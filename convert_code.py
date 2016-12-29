import re
import sys

IMPORT = r'^.*?define.*?function.*?\((.*?)\)'
FROM = r'^.*?define.*?\[(.*?)\]'
CLASS_NAME = r'^.*?define.*?function.*?var\s(.*?)\s'
BODY = r'^.*?define.*?function.*?var.*?Class\.create\(\n(.*?)\n\t\t\);'
FUNCTION = r'^(.*?):[ ]function(\(.*\))$'
MEMBER = r'^[ ]{2}.+?:[ ].+?,$'

TEMPLATE = '''
{IMPORTS}
class {CLASS_NAME}{EXTENDS}
{BODY}

export default {CLASS_NAME};

'''


def convert_file(file_path):
    result = ''
    try:
        with open(file_path) as file:
            file_data = file.read()

            m_import = re.match(IMPORT, file_data, re.S)
            import_list = list(s.strip() for s in
                               m_import.groups()[0].split(','))
            m_from = re.match(FROM, file_data, re.S)
            from_list = list(s.strip() for s in
                             m_from.groups()[0].split(','))
            class_name = re.match(CLASS_NAME, file_data, re.S).groups()[0]
            body_lines = re.match(BODY, file_data,
                                  re.S).groups()[0].split('\n')
            extends = ''
            new_lines = []
            for idx, line in enumerate(body_lines):
                new_line = line[3:].replace('\t', '  ')
                if idx == 0 and new_line[0] != '{' and new_line[:2] != r'/*':
                    extends = ' extends %s' % new_line.strip().replace(',', '')
                elif new_line[2:] == '},':
                    new_lines.append('  }')
                elif re.match(FUNCTION, new_line):
                    m_function = re.match(FUNCTION, new_line)
                    f_name = m_function.groups()[0]
                    f_name = f_name.replace('initialize', 'constructor')
                    f_params = m_function.groups()[1]
                    f_params = f_params.replace('$super, ', '')
                    f_params = f_params.replace('$super', '')
                    new_lines.append('%s%s' % (f_name, f_params))
                elif re.match(MEMBER, new_line):
                    new_lines.append('  // %s' % new_line[2:])
                else:
                    new_lines.append(new_line)
            imports = ''
            for item in zip(import_list, from_list):
                if item[0] == '' or item[1] == '':
                    continue
                imports += 'import %s from %s;\n' % item
            body = '\n'.join(new_lines)

            result = TEMPLATE.format(
                IMPORTS=imports,
                CLASS_NAME=class_name,
                EXTENDS=extends,
                BODY=body)
    except Exception, e:
        print e
        exit(1)

    print result


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print 'incorrect number of arguments'
        exit(1)
    file_path = sys.argv[1]
    convert_file(file_path)
