require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":1,"ieee754":7,"isarray":10}],4:[function(require,module,exports){
module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}

},{}],5:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":9}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],7:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],10:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],11:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":12}],12:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],16:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":14,"./encode":15}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":19,"./_stream_writable":21,"core-util-is":5,"inherits":8,"process-nextick-args":11}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":20,"core-util-is":5,"inherits":8}],19:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":17,"./internal/streams/BufferList":22,"./internal/streams/destroy":23,"./internal/streams/stream":24,"_process":12,"core-util-is":5,"events":6,"inherits":8,"isarray":10,"process-nextick-args":11,"safe-buffer":26,"string_decoder/":31,"util":2}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":17,"core-util-is":5,"inherits":8}],21:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/
var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":17,"./internal/streams/destroy":23,"./internal/streams/stream":24,"_process":12,"core-util-is":5,"inherits":8,"process-nextick-args":11,"safe-buffer":26,"util-deprecate":35}],22:[function(require,module,exports){
'use strict';

/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();
},{"safe-buffer":26}],23:[function(require,module,exports){
'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":11}],24:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":6}],25:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":17,"./lib/_stream_passthrough.js":18,"./lib/_stream_readable.js":19,"./lib/_stream_transform.js":20,"./lib/_stream_writable.js":21}],26:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":3}],27:[function(require,module,exports){
(function (global){
var ClientRequest = require('./lib/request')
var extend = require('xtend')
var statusCodes = require('builtin-status-codes')
var url = require('url')

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/request":29,"builtin-status-codes":4,"url":33,"xtend":36}],28:[function(require,module,exports){
(function (global){
exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.blobConstructor = false
try {
	new Blob([new ArrayBuffer(1)])
	exports.blobConstructor = true
} catch (e) {}

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr
function getXHR () {
	// Cache the xhr value
	if (xhr !== undefined) return xhr

	if (global.XMLHttpRequest) {
		xhr = new global.XMLHttpRequest()
		// If XDomainRequest is available (ie only, where xhr might not work
		// cross domain), use the page location. Otherwise use example.com
		// Note: this doesn't actually make an http request.
		try {
			xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
		} catch(e) {
			xhr = null
		}
	} else {
		// Service workers don't have XHR
		xhr = null
	}
	return xhr
}

function checkTypeSupport (type) {
	var xhr = getXHR()
	if (!xhr) return false
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
	checkTypeSupport('moz-chunked-arraybuffer')

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

exports.vbArray = isFunction(global.VBArray)

function isFunction (value) {
	return typeof value === 'function'
}

xhr = null // Help gc

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],29:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var response = require('./response')
var stream = require('readable-stream')
var toArrayBuffer = require('to-arraybuffer')

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary, useFetch) {
	if (capability.fetch && useFetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else if (capability.vbArray && preferBinary) {
		return 'text:vbarray'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	var useFetch = true
	if (opts.mode === 'disable-fetch' || 'timeout' in opts) {
		// If the use of XHR should be preferred and includes preserving the 'content-type' header.
		// Force XHR to be used since the Fetch API does not yet support timeouts.
		useFetch = false
		preferBinary = true
	} else if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary, useFetch)

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var header = this._headers[name.toLowerCase()]
	if (header)
		return header.value
	return null
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body = null
	if (opts.method !== 'GET' && opts.method !== 'HEAD') {
		if (capability.blobConstructor) {
			body = new global.Blob(self._body.map(function (buffer) {
				return toArrayBuffer(buffer)
			}), {
				type: (headersObj['content-type'] || {}).value || ''
			})
		} else {
			// get utf8 string
			body = Buffer.concat(self._body).toString()
		}
	}

	// create flattened list of headers
	var headersList = []
	Object.keys(headersObj).forEach(function (keyName) {
		var name = headersObj[keyName].name
		var value = headersObj[keyName].value
		if (Array.isArray(value)) {
			value.forEach(function (v) {
				headersList.push([name, v])
			})
		} else {
			headersList.push([name, value])
		}
	})

	if (self._mode === 'fetch') {
		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headersList,
			body: body || undefined,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin'
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode.split(':')[0]

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		if ('timeout' in opts) {
			xhr.timeout = opts.timeout
			xhr.ontimeout = function () {
				self.emit('timeout')
			}
		}

		headersList.forEach(function (header) {
			xhr.setRequestHeader(header[0], header[1])
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode)
	self._response.on('error', function(err) {
		self.emit('error', err)
	})

	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	// Currently, there isn't a way to truly abort a fetch.
	// If you like bikeshedding, see https://github.com/whatwg/fetch/issues/27
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'user-agent',
	'via'
]

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":28,"./response":30,"_process":12,"buffer":3,"inherits":8,"readable-stream":25,"to-arraybuffer":32}],30:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var stream = require('readable-stream')

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		
		response.headers.forEach(function(header, key){
			self.headers[key.toLowerCase()] = header
			self.rawHeaders.push(key, header)
		})


		// TODO: this doesn't respect backpressure. Once WritableStream is available, this can be fixed
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					self.push(null)
					return
				}
				self.push(new Buffer(result.value))
				read()
			}).catch(function(err) {
				self.emit('error', err)
			})
		}
		read()

	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text:vbarray': // For IE9
			if (xhr.readyState !== rStates.DONE)
				break
			try {
				// This fails in IE8
				response = new global.VBArray(xhr.responseBody).toArray()
			} catch (e) {}
			if (response !== null) {
				self.push(new Buffer(response))
				break
			}
			// Falls through in IE8	
		case 'text':
			try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
				response = xhr.responseText
			} catch (e) {
				self._mode = 'text:vbarray'
				break
			}
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = new Buffer(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE || !xhr.response)
				break
			response = xhr.response
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":28,"_process":12,"buffer":3,"inherits":8,"readable-stream":25}],31:[function(require,module,exports){
'use strict';

var Buffer = require('safe-buffer').Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":26}],32:[function(require,module,exports){
var Buffer = require('buffer').Buffer

module.exports = function (buf) {
	// If the buffer is backed by a Uint8Array, a faster version will work
	if (buf instanceof Uint8Array) {
		// If the buffer isn't a subarray, return the underlying ArrayBuffer
		if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
			return buf.buffer
		} else if (typeof buf.buffer.slice === 'function') {
			// Otherwise we need to get a proper copy
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
		}
	}

	if (Buffer.isBuffer(buf)) {
		// This is the slow version that will work with any Buffer
		// implementation (even in old browsers)
		var arrayCopy = new Uint8Array(buf.length)
		var len = buf.length
		for (var i = 0; i < len; i++) {
			arrayCopy[i] = buf[i]
		}
		return arrayCopy.buffer
	} else {
		throw new Error('Argument must be a Buffer')
	}
}

},{"buffer":3}],33:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":34,"punycode":13,"querystring":16}],34:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],35:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],36:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  STARTUP: "Startup",
  SHUTDOWN: "Shutdown",
  MANAGER_PREP: "ManagerPrep",

  SHOW_VIEW: "ShowView",

  LOAD_TITLE: "LoadTitle",
  LOAD_GAME: "LoadGame",
  LOAD_OPTIONS: "LoadOptions",

  LOAD_VIEW_RESOURCES: "LoadViewResources",
  LOAD_ENGINE_RESOURCES: "LoadEngineResources",

  EXIT_APP: "ExitApp"

};

},{}],38:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _StartupCommand = require('app/controller/StartupCommand');

var _StartupCommand2 = _interopRequireDefault(_StartupCommand);

var _ManagerPrepCommand = require('app/controller/ManagerPrepCommand');

var _ManagerPrepCommand2 = _interopRequireDefault(_ManagerPrepCommand);

var _ShutdownCommand = require('app/controller/ShutdownCommand');

var _ShutdownCommand2 = _interopRequireDefault(_ShutdownCommand);

var _LoadTitleCommand = require('app/controller/LoadTitleCommand');

var _LoadTitleCommand2 = _interopRequireDefault(_LoadTitleCommand);

var _LoadGameCommand = require('app/controller/LoadGameCommand');

var _LoadGameCommand2 = _interopRequireDefault(_LoadGameCommand);

var _LoadOptionsCommand = require('app/controller/LoadOptionsCommand');

var _LoadOptionsCommand2 = _interopRequireDefault(_LoadOptionsCommand);

var _LoadViewResourcesCommand = require('app/controller/LoadViewResourcesCommand');

var _LoadViewResourcesCommand2 = _interopRequireDefault(_LoadViewResourcesCommand);

var _LoadEngineResourcesCommand = require('app/controller/LoadEngineResourcesCommand');

var _LoadEngineResourcesCommand2 = _interopRequireDefault(_LoadEngineResourcesCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApplicationFacade = function (_puremvc$Facade) {
  _inherits(ApplicationFacade, _puremvc$Facade);

  // scene: null,

  function ApplicationFacade(key) {
    _classCallCheck(this, ApplicationFacade);

    return _possibleConstructorReturn(this, (ApplicationFacade.__proto__ || Object.getPrototypeOf(ApplicationFacade)).call(this, key));
  }

  _createClass(ApplicationFacade, [{
    key: 'initializeController',
    value: function initializeController() {
      _get(ApplicationFacade.prototype.__proto__ || Object.getPrototypeOf(ApplicationFacade.prototype), 'initializeController', this).call(this);
      this.registerCommand(_ApplicationConstants2.default.STARTUP, _StartupCommand2.default);
      this.registerCommand(_ApplicationConstants2.default.SHUTDOWN, _ShutdownCommand2.default);
      this.registerCommand(_ApplicationConstants2.default.MANAGER_PREP, _ManagerPrepCommand2.default);

      this.registerCommand(_ApplicationConstants2.default.LOAD_TITLE, _LoadTitleCommand2.default);
      this.registerCommand(_ApplicationConstants2.default.LOAD_GAME, _LoadGameCommand2.default);
      this.registerCommand(_ApplicationConstants2.default.LOAD_OPTIONS, _LoadOptionsCommand2.default);

      this.registerCommand(_ApplicationConstants2.default.LOAD_VIEW_RESOURCES, _LoadViewResourcesCommand2.default);
      this.registerCommand(_ApplicationConstants2.default.LOAD_ENGINE_RESOURCES, _LoadEngineResourcesCommand2.default);
    }
  }, {
    key: 'startup',
    value: function startup(options) {
      this.sendNotification(_ApplicationConstants2.default.STARTUP, options);
    }
  }, {
    key: 'shutdown',
    value: function shutdown(options) {
      this.sendNotification(_ApplicationConstants2.default.SHUTDOWN, options);
    }
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render(dt) {
      this.scene.clear();
      this.scene.render(dt);
    }
  }, {
    key: 'setScene',
    value: function setScene(scene) {
      this.scene = scene;
    }
  }, {
    key: 'getScene',
    value: function getScene() {
      return scene;
    }
  }]);

  return ApplicationFacade;
}(_puremvc2.default.Facade);

ApplicationFacade.getInstance = function (key) {
  if (!_puremvc2.default.Facade.hasCore(key)) {
    new ApplicationFacade(key);
  }
  var retVal = _puremvc2.default.Facade.getInstance(key);
  return retVal;
};

ApplicationFacade.removeCore = function (key) {
  _puremvc2.default.Facade.removeCore(key);
};

ApplicationFacade.KEY = "App.Shell";

exports.default = ApplicationFacade;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/controller/LoadEngineResourcesCommand":39,"app/controller/LoadGameCommand":40,"app/controller/LoadOptionsCommand":41,"app/controller/LoadTitleCommand":42,"app/controller/LoadViewResourcesCommand":43,"app/controller/ManagerPrepCommand":45,"app/controller/ShutdownCommand":48,"app/controller/StartupCommand":49,"minibot":"minibot"}],39:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadEngineResourcesCommand = function (_puremvc$SimpleComman) {
  _inherits(LoadEngineResourcesCommand, _puremvc$SimpleComman);

  function LoadEngineResourcesCommand() {
    _classCallCheck(this, LoadEngineResourcesCommand);

    return _possibleConstructorReturn(this, (LoadEngineResourcesCommand.__proto__ || Object.getPrototypeOf(LoadEngineResourcesCommand)).apply(this, arguments));
  }

  _createClass(LoadEngineResourcesCommand, [{
    key: 'execute',
    value: function execute(notification) {
      var engine = notification.getBody();
      var resources = engine.getResources();

      var resourceProxy = this.facade.retrieveProxy(_ResourceProxy2.default.NAME);

      for (var type in resources) {
        for (var id in resources[type]) {
          if (resources[type][id] == null) {
            resources[type][id] = resourceProxy.getResource(type, id);
          }
        }
      }

      engine.onResourcesLoaded();
    }
  }]);

  return LoadEngineResourcesCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = LoadEngineResourcesCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/model/ResourceProxy":98}],40:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _GameMediator = require('app/view/GameMediator');

var _GameMediator2 = _interopRequireDefault(_GameMediator);

var _Game = require('app/display/Game');

var _Game2 = _interopRequireDefault(_Game);

var _Engine = require('app/engine/Engine');

var _Engine2 = _interopRequireDefault(_Engine);

var _SoundProxy = require('app/model/SoundProxy');

var _SoundProxy2 = _interopRequireDefault(_SoundProxy);

var _DataProxy = require('app/model/DataProxy');

var _DataProxy2 = _interopRequireDefault(_DataProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadGameCommand = function (_puremvc$SimpleComman) {
    _inherits(LoadGameCommand, _puremvc$SimpleComman);

    function LoadGameCommand() {
        _classCallCheck(this, LoadGameCommand);

        return _possibleConstructorReturn(this, (LoadGameCommand.__proto__ || Object.getPrototypeOf(LoadGameCommand)).apply(this, arguments));
    }

    _createClass(LoadGameCommand, [{
        key: 'execute',
        value: function execute(notification) {
            console.log('LoadGameCommand::execute');

            var levelNum = notification.getBody();
            if (!levelNum) levelNum = 1;

            // Load the Game view resources
            this.sendNotification(_ApplicationConstants2.default.LOAD_VIEW_RESOURCES, _Game2.default);

            var dataProxy = this.facade.retrieveProxy(_DataProxy2.default.NAME);
            var level = dataProxy.getLevel(levelNum);

            // Create the engine
            var engine = new _Engine2.default(level);

            var soundProxy = this.facade.retrieveProxy(_SoundProxy2.default.NAME);
            // soundProxy.setBgm('bgm.game');

            // Add the engine to the update loop
            _minibot2.default.system.SetUpdateCallback(engine.update.bind(engine));

            // Load the Engine resources
            this.sendNotification(_ApplicationConstants2.default.LOAD_ENGINE_RESOURCES, engine);

            // Create the Game view
            var viewData = {};
            viewData.level = level;
            viewData.engine = engine;
            viewData.soundProxy = soundProxy;
            var view = new _Game2.default(viewData);

            // Register the Mediator
            this.facade.registerMediator(new _GameMediator2.default(view));

            // Show the new view
            this.sendNotification(_ApplicationConstants2.default.SHOW_VIEW, view);
        }
    }]);

    return LoadGameCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = LoadGameCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/display/Game":53,"app/engine/Engine":67,"app/model/DataProxy":97,"app/model/SoundProxy":99,"app/view/GameMediator":105,"minibot":"minibot"}],41:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _OptionsMediator = require('app/view/OptionsMediator');

var _OptionsMediator2 = _interopRequireDefault(_OptionsMediator);

var _Options = require('app/display/Options');

var _Options2 = _interopRequireDefault(_Options);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//SoundProxy from 'app/model/ResourceProxy'
//'app/model/SoundProxy';

var LoadOptionsCommand = function (_puremvc$SimpleComman) {
    _inherits(LoadOptionsCommand, _puremvc$SimpleComman);

    function LoadOptionsCommand() {
        _classCallCheck(this, LoadOptionsCommand);

        return _possibleConstructorReturn(this, (LoadOptionsCommand.__proto__ || Object.getPrototypeOf(LoadOptionsCommand)).apply(this, arguments));
    }

    _createClass(LoadOptionsCommand, [{
        key: 'execute',
        value: function execute(notification) {
            console.log('LoadOptionsCommand::execute');

            var resourceProxy = this.facade.retrieveProxy(_ResourceProxy2.default.NAME);

            //var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
            //soundProxy.setBgm('bgm.menu');

            var data = {};

            var view = new _Options2.default(data);
            this.facade.registerMediator(new _OptionsMediator2.default(view));

            this.sendNotification(_ApplicationConstants2.default.SHOW_VIEW, view);
        }
    }]);

    return LoadOptionsCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = LoadOptionsCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/display/Options":54,"app/model/ResourceProxy":98,"app/view/OptionsMediator":106}],42:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _TitleMediator = require('app/view/TitleMediator');

var _TitleMediator2 = _interopRequireDefault(_TitleMediator);

var _Title = require('app/display/Title');

var _Title2 = _interopRequireDefault(_Title);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//SoundProxy from 'app/model/ResourceProxy'
//'app/model/SoundProxy';

var LoadTitleCommand = function (_puremvc$SimpleComman) {
    _inherits(LoadTitleCommand, _puremvc$SimpleComman);

    function LoadTitleCommand() {
        _classCallCheck(this, LoadTitleCommand);

        return _possibleConstructorReturn(this, (LoadTitleCommand.__proto__ || Object.getPrototypeOf(LoadTitleCommand)).apply(this, arguments));
    }

    _createClass(LoadTitleCommand, [{
        key: 'execute',
        value: function execute(notification) {
            console.log('LoadTitleCommand::execute');

            // Load the view resources
            this.sendNotification(_ApplicationConstants2.default.LOAD_VIEW_RESOURCES, _Title2.default);

            //var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
            //soundProxy.setBgm('bgm.menu');

            var data = {};

            var view = new _Title2.default(data);
            this.facade.registerMediator(new _TitleMediator2.default(view));

            this.sendNotification(_ApplicationConstants2.default.SHOW_VIEW, view);
        }
    }]);

    return LoadTitleCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = LoadTitleCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/display/Title":56,"app/model/ResourceProxy":98,"app/view/TitleMediator":108}],43:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadViewResourcesCommand = function (_puremvc$SimpleComman) {
  _inherits(LoadViewResourcesCommand, _puremvc$SimpleComman);

  function LoadViewResourcesCommand() {
    _classCallCheck(this, LoadViewResourcesCommand);

    return _possibleConstructorReturn(this, (LoadViewResourcesCommand.__proto__ || Object.getPrototypeOf(LoadViewResourcesCommand)).apply(this, arguments));
  }

  _createClass(LoadViewResourcesCommand, [{
    key: 'execute',
    value: function execute(notification) {
      var klass = notification.getBody();

      var resourceProxy = this.facade.retrieveProxy(_ResourceProxy2.default.NAME);

      if (klass.RESOURCES != undefined) {
        for (var type in klass.RESOURCES) {
          for (var id in klass.RESOURCES[type]) {
            if (klass.RESOURCES[type][id] == null) {
              klass.RESOURCES[type][id] = resourceProxy.getResource(type, id);
            }
          }
        }
      }

      if (klass.OBJECTS != undefined) {
        for (var i = 0; i < klass.OBJECTS.length; i++) {
          var klassObject = klass.OBJECTS[i];
          this.sendNotification(_ApplicationConstants2.default.LOAD_VIEW_RESOURCES, klassObject);
        }
      }
    }
  }]);

  return LoadViewResourcesCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = LoadViewResourcesCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/model/ResourceProxy":98,"minibot":"minibot"}],44:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _DataProxy = require('app/model/DataProxy');

var _DataProxy2 = _interopRequireDefault(_DataProxy);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

var _SoundProxy = require('app/model/SoundProxy');

var _SoundProxy2 = _interopRequireDefault(_SoundProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = _minibot2.default.core.Utils;

var ManagerDestroyCommand = function (_puremvc$SimpleComman) {
    _inherits(ManagerDestroyCommand, _puremvc$SimpleComman);

    function ManagerDestroyCommand() {
        _classCallCheck(this, ManagerDestroyCommand);

        return _possibleConstructorReturn(this, (ManagerDestroyCommand.__proto__ || Object.getPrototypeOf(ManagerDestroyCommand)).apply(this, arguments));
    }

    _createClass(ManagerDestroyCommand, [{
        key: 'execute',
        value: function execute(notification) {
            console.log('App::ManagerDestroyCommand');
            // var data = notification.getBody();

            // var progressCallback = data.progressCallback;
            // var completeCallback = data.completeCallback;

            // // Load and initialize the data
            // var dataProxy = this.facade.retrieveProxy(DataProxy.NAME);
            // if(!dataProxy.isManagerLoaded) {
            //   dataProxy.initDataManager(Utils.Bind(function() {
            //     console.log('App::ManagerDestroyCommand - Finished Prepping Data');
            //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
            //   }, this), progressCallback);
            //   return;
            // }

            // // Load and initialize the resources
            // var resourceProxy = this.facade.retrieveProxy(ResourceProxy.NAME);
            // if(!resourceProxy.isManagerLoaded) {
            //   resourceProxy.initResourceManager(Utils.Bind(function() {
            //     console.log('App::ManagerDestroyCommand - Finished Prepping Resources');
            //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
            //   }, this), progressCallback);
            //   return;
            // }

            // // Load and initialize the sounds
            // // var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
            // // if(!soundProxy.isManagerLoaded) {
            // //   soundProxy.initSoundManager(function() {
            // //     console.log('App::ManagerDestroyCommand - Finished Prepping Sounds');
            // //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
            // //   }.bind(this), progressCallback);
            // //   return;
            // // }

            // this.sendNotification(ApplicationConstants.LOAD_TITLE);

            // // This will let the loader know that the app has completed loading
            // // and the loading screen will be removed.

            // Stop the system
            _minibot2.default.system.Stop();

            // Utils.Defer(completeCallback, this);
        }
    }]);

    return ManagerDestroyCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ManagerDestroyCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/model/DataProxy":97,"app/model/ResourceProxy":98,"app/model/SoundProxy":99,"minibot":"minibot"}],45:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _DataProxy = require('app/model/DataProxy');

var _DataProxy2 = _interopRequireDefault(_DataProxy);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

var _SoundProxy = require('app/model/SoundProxy');

var _SoundProxy2 = _interopRequireDefault(_SoundProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = _minibot2.default.core.Utils;

var ManagerPrepCommand = function (_puremvc$SimpleComman) {
    _inherits(ManagerPrepCommand, _puremvc$SimpleComman);

    function ManagerPrepCommand() {
        _classCallCheck(this, ManagerPrepCommand);

        return _possibleConstructorReturn(this, (ManagerPrepCommand.__proto__ || Object.getPrototypeOf(ManagerPrepCommand)).apply(this, arguments));
    }

    _createClass(ManagerPrepCommand, [{
        key: 'execute',
        value: function execute(notification) {
            var data = notification.getBody();

            var progressCallback = data.progressCallback;
            var completeCallback = data.completeCallback;

            // Load and initialize the data
            var dataProxy = this.facade.retrieveProxy(_DataProxy2.default.NAME);
            if (!dataProxy.isManagerLoaded) {
                dataProxy.initDataManager(Utils.Bind(function () {
                    console.log('App::ManagerPrepCommand - Finished Prepping Data');
                    this.sendNotification(_ApplicationConstants2.default.MANAGER_PREP, data);
                }, this), progressCallback);
                return;
            }

            // Load and initialize the resources
            var resourceProxy = this.facade.retrieveProxy(_ResourceProxy2.default.NAME);
            if (!resourceProxy.isManagerLoaded) {
                resourceProxy.initResourceManager(Utils.Bind(function () {
                    console.log('App::ManagerPrepCommand - Finished Prepping Resources');
                    this.sendNotification(_ApplicationConstants2.default.MANAGER_PREP, data);
                }, this), progressCallback);
                return;
            }

            // Load and initialize the sounds
            // var soundProxy = this.facade.retrieveProxy(SoundProxy.NAME);
            // if(!soundProxy.isManagerLoaded) {
            //   soundProxy.initSoundManager(function() {
            //     console.log('App::ManagerPrepCommand - Finished Prepping Sounds');
            //     this.sendNotification(ApplicationConstants.MANAGER_PREP, data);
            //   }.bind(this), progressCallback);
            //   return;
            // }

            this.sendNotification(_ApplicationConstants2.default.LOAD_TITLE);

            // This will let the loader know that the app has completed loading
            // and the loading screen will be removed.

            // Run the system
            _minibot2.default.system.Run();

            Utils.Defer(completeCallback, this);
        }
    }]);

    return ManagerPrepCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ManagerPrepCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37,"app/model/DataProxy":97,"app/model/ResourceProxy":98,"app/model/SoundProxy":99,"minibot":"minibot"}],46:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _DataProxy = require('app/model/DataProxy');

var _DataProxy2 = _interopRequireDefault(_DataProxy);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

var _SoundProxy = require('app/model/SoundProxy');

var _SoundProxy2 = _interopRequireDefault(_SoundProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModelDestroyCommand = function (_puremvc$SimpleComman) {
  _inherits(ModelDestroyCommand, _puremvc$SimpleComman);

  function ModelDestroyCommand() {
    _classCallCheck(this, ModelDestroyCommand);

    return _possibleConstructorReturn(this, (ModelDestroyCommand.__proto__ || Object.getPrototypeOf(ModelDestroyCommand)).apply(this, arguments));
  }

  _createClass(ModelDestroyCommand, [{
    key: 'execute',
    value: function execute(notification) {
      console.log('App::ModelDestroyCommand');
      // this.facade.registerProxy(new DataProxy());
      // this.facade.registerProxy(new ResourceProxy());
      // this.facade.registerProxy(new SoundProxy());
    }
  }]);

  return ModelDestroyCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ModelDestroyCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/model/DataProxy":97,"app/model/ResourceProxy":98,"app/model/SoundProxy":99}],47:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _DataProxy = require('app/model/DataProxy');

var _DataProxy2 = _interopRequireDefault(_DataProxy);

var _ResourceProxy = require('app/model/ResourceProxy');

var _ResourceProxy2 = _interopRequireDefault(_ResourceProxy);

var _SoundProxy = require('app/model/SoundProxy');

var _SoundProxy2 = _interopRequireDefault(_SoundProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModelPrepCommand = function (_puremvc$SimpleComman) {
  _inherits(ModelPrepCommand, _puremvc$SimpleComman);

  function ModelPrepCommand() {
    _classCallCheck(this, ModelPrepCommand);

    return _possibleConstructorReturn(this, (ModelPrepCommand.__proto__ || Object.getPrototypeOf(ModelPrepCommand)).apply(this, arguments));
  }

  _createClass(ModelPrepCommand, [{
    key: 'execute',
    value: function execute(notification) {
      this.facade.registerProxy(new _DataProxy2.default());
      this.facade.registerProxy(new _ResourceProxy2.default());
      this.facade.registerProxy(new _SoundProxy2.default());
    }
  }]);

  return ModelPrepCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ModelPrepCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/model/DataProxy":97,"app/model/ResourceProxy":98,"app/model/SoundProxy":99}],48:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ModelDestroyCommand = require('app/controller/ModelDestroyCommand');

var _ModelDestroyCommand2 = _interopRequireDefault(_ModelDestroyCommand);

var _ViewDestroyCommand = require('app/controller/ViewDestroyCommand');

var _ViewDestroyCommand2 = _interopRequireDefault(_ViewDestroyCommand);

var _ManagerDestroyCommand = require('app/controller/ManagerDestroyCommand');

var _ManagerDestroyCommand2 = _interopRequireDefault(_ManagerDestroyCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StartupCommand = function (_puremvc$MacroCommand) {
  _inherits(StartupCommand, _puremvc$MacroCommand);

  function StartupCommand() {
    _classCallCheck(this, StartupCommand);

    return _possibleConstructorReturn(this, (StartupCommand.__proto__ || Object.getPrototypeOf(StartupCommand)).apply(this, arguments));
  }

  _createClass(StartupCommand, [{
    key: 'initializeMacroCommand',
    value: function initializeMacroCommand() {
      this.addSubCommand(_ModelDestroyCommand2.default);
      this.addSubCommand(_ViewDestroyCommand2.default);
      this.addSubCommand(_ManagerDestroyCommand2.default);
    }
  }]);

  return StartupCommand;
}(_puremvc2.default.MacroCommand);

exports.default = StartupCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/controller/ManagerDestroyCommand":44,"app/controller/ModelDestroyCommand":46,"app/controller/ViewDestroyCommand":50}],49:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ModelPrepCommand = require('app/controller/ModelPrepCommand');

var _ModelPrepCommand2 = _interopRequireDefault(_ModelPrepCommand);

var _ViewPrepCommand = require('app/controller/ViewPrepCommand');

var _ViewPrepCommand2 = _interopRequireDefault(_ViewPrepCommand);

var _ManagerPrepCommand = require('app/controller/ManagerPrepCommand');

var _ManagerPrepCommand2 = _interopRequireDefault(_ManagerPrepCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StartupCommand = function (_puremvc$MacroCommand) {
  _inherits(StartupCommand, _puremvc$MacroCommand);

  function StartupCommand() {
    _classCallCheck(this, StartupCommand);

    return _possibleConstructorReturn(this, (StartupCommand.__proto__ || Object.getPrototypeOf(StartupCommand)).apply(this, arguments));
  }

  _createClass(StartupCommand, [{
    key: 'initializeMacroCommand',
    value: function initializeMacroCommand() {
      this.addSubCommand(_ModelPrepCommand2.default);
      this.addSubCommand(_ViewPrepCommand2.default);
      this.addSubCommand(_ManagerPrepCommand2.default);
    }
  }]);

  return StartupCommand;
}(_puremvc2.default.MacroCommand);

exports.default = StartupCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/controller/ManagerPrepCommand":45,"app/controller/ModelPrepCommand":47,"app/controller/ViewPrepCommand":51}],50:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ShellMediator = require('app/view/ShellMediator');

var _ShellMediator2 = _interopRequireDefault(_ShellMediator);

var _Shell = require('app/display/Shell');

var _Shell2 = _interopRequireDefault(_Shell);

var _BaseView = require('app/display/BaseView');

var _BaseView2 = _interopRequireDefault(_BaseView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = _minibot2.default.core.Utils;

var ViewDestroyCommand = function (_puremvc$SimpleComman) {
    _inherits(ViewDestroyCommand, _puremvc$SimpleComman);

    function ViewDestroyCommand() {
        _classCallCheck(this, ViewDestroyCommand);

        return _possibleConstructorReturn(this, (ViewDestroyCommand.__proto__ || Object.getPrototypeOf(ViewDestroyCommand)).apply(this, arguments));
    }

    _createClass(ViewDestroyCommand, [{
        key: 'execute',
        value: function execute(notification) {
            console.log('App::ViewDestroyCommand');
            // var data = notification.getBody();

            // var sceneOptions = {};
            // if(data['sceneOptions'] != undefined) {
            //   sceneOptions = data.sceneOptions;
            // }

            // var scene = minibot.system.CreateScene(sceneOptions);
            // this.facade.setScene(scene);
            // minibot.system.SetRenderCallback(Utils.Bind(this.facade.render, this.facade));

            // var shell = new Shell(scene);
            // this.facade.registerMediator(new ShellMediator(shell));

            // BaseView.WIDTH = scene.getWidth();
            // BaseView.HEIGHT = scene.getHeight();
        }
    }]);

    return ViewDestroyCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ViewDestroyCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/display/BaseView":52,"app/display/Shell":55,"app/view/ShellMediator":107,"minibot":"minibot"}],51:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ShellMediator = require('app/view/ShellMediator');

var _ShellMediator2 = _interopRequireDefault(_ShellMediator);

var _Shell = require('app/display/Shell');

var _Shell2 = _interopRequireDefault(_Shell);

var _BaseView = require('app/display/BaseView');

var _BaseView2 = _interopRequireDefault(_BaseView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = _minibot2.default.core.Utils;

var ViewPrepCommand = function (_puremvc$SimpleComman) {
    _inherits(ViewPrepCommand, _puremvc$SimpleComman);

    function ViewPrepCommand() {
        _classCallCheck(this, ViewPrepCommand);

        return _possibleConstructorReturn(this, (ViewPrepCommand.__proto__ || Object.getPrototypeOf(ViewPrepCommand)).apply(this, arguments));
    }

    _createClass(ViewPrepCommand, [{
        key: 'execute',
        value: function execute(notification) {
            var data = notification.getBody();

            var sceneOptions = {};
            if (data['sceneOptions'] != undefined) {
                sceneOptions = data.sceneOptions;
            }

            var scene = _minibot2.default.system.CreateScene(sceneOptions);
            this.facade.setScene(scene);
            _minibot2.default.system.SetRenderCallback(Utils.Bind(this.facade.render, this.facade));

            var shell = new _Shell2.default(scene);
            this.facade.registerMediator(new _ShellMediator2.default(shell, data));

            _BaseView2.default.WIDTH = scene.getWidth();
            _BaseView2.default.HEIGHT = scene.getHeight();

            console.log('App::ViewPrepCommand - At End');
        }
    }]);

    return ViewPrepCommand;
}(_puremvc2.default.SimpleCommand);

exports.default = ViewPrepCommand;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/display/BaseView":52,"app/display/Shell":55,"app/view/ShellMediator":107,"minibot":"minibot"}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseView = function (_minibot$display$scen) {
  _inherits(BaseView, _minibot$display$scen);

  // data: null,

  function BaseView(data) {
    _classCallCheck(this, BaseView);

    var _this = _possibleConstructorReturn(this, (BaseView.__proto__ || Object.getPrototypeOf(BaseView)).call(this));

    _this.setWidth(BaseView.WIDTH);
    _this.setHeight(BaseView.HEIGHT);
    _this.resizable = false;
    _this.scalable = false;
    _this.data = data;
    return _this;
  }

  return BaseView;
}(_minibot2.default.display.scene.Container);

exports.default = BaseView;

},{"minibot":"minibot"}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseView2 = require('app/display/BaseView');

var _BaseView3 = _interopRequireDefault(_BaseView2);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _InputType = require('app/engine/enum/InputType');

var _InputType2 = _interopRequireDefault(_InputType);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _GameTimer = require('app/display/game/GameTimer');

var _GameTimer2 = _interopRequireDefault(_GameTimer);

var _ComboMeter = require('app/display/game/ComboMeter');

var _ComboMeter2 = _interopRequireDefault(_ComboMeter);

var _MatchesCounter = require('app/display/game/MatchesCounter');

var _MatchesCounter2 = _interopRequireDefault(_MatchesCounter);

var _MainMenuButton = require('app/display/component/MainMenuButton');

var _MainMenuButton2 = _interopRequireDefault(_MainMenuButton);

var _GameUiHorz = require('app/display/game/GameUiHorz');

var _GameUiHorz2 = _interopRequireDefault(_GameUiHorz);

var _GameUiVert = require('app/display/game/GameUiVert');

var _GameUiVert2 = _interopRequireDefault(_GameUiVert);

var _Bat = require('app/display/game/Bat');

var _Bat2 = _interopRequireDefault(_Bat);

var _GameWin = require('app/display/game/GameWin');

var _GameWin2 = _interopRequireDefault(_GameWin);

var _GameFail = require('app/display/game/GameFail');

var _GameFail2 = _interopRequireDefault(_GameFail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseEvent = _minibot2.default.event.MouseEvent,
    TouchEvent = _minibot2.default.event.TouchEvent,
    DisplayObject = _minibot2.default.display.DisplayObject,
    Sprite = _minibot2.default.display.scene.Sprite,
    Rect = _minibot2.default.display.scene.Rect,
    Rectangle = _minibot2.default.geom.Rectangle,
    MouseEvent = _minibot2.default.event.MouseEvent,
    Color = _minibot2.default.graphics.Color,
    BindAsEventListener = _minibot2.default.core.Utils.BindAsEventListener;

var Game = function (_BaseView) {
  _inherits(Game, _BaseView);

  function Game(data) {
    _classCallCheck(this, Game);

    // var rect = new Rect(this.w, this.h, "", Color.FromHex("#CCCCCC"));
    // this.addChild(rect);
    // var buttonExit = new MainMenuButton("x", this.w*0.1, this.h*0.2);
    // this.addChild(buttonExit);
    // buttonExit.x = this.w*0.8;
    // buttonExit.y = this.h*0.1;

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, data));

    _this.viewport = null;
    _this.engine = data.engine;

    // Add mouse event listeners
    _this.addEventListener(MouseEvent.MOUSE_DOWN, BindAsEventListener(_this.handleMouseDown, _this));
    _this.addEventListener(MouseEvent.MOUSE_MOVE, BindAsEventListener(_this.handleMouseMove, _this));
    _this.addEventListener(MouseEvent.MOUSE_UP, BindAsEventListener(_this.handleMouseUp, _this));

    // Add touch event listeners
    _this.addEventListener(TouchEvent.TOUCH_START, BindAsEventListener(_this.handleTouchStart, _this));
    _this.addEventListener(TouchEvent.TOUCH_MOVE, BindAsEventListener(_this.handleTouchMove, _this));
    _this.addEventListener(TouchEvent.TOUCH_END, BindAsEventListener(_this.handleTouchEnd, _this));
    return _this;
  }

  _createClass(Game, [{
    key: 'onAddedToScene',
    value: function onAddedToScene() {
      _get(Game.prototype.__proto__ || Object.getPrototypeOf(Game.prototype), 'onAddedToScene', this).call(this);
      var size = Math.min(this.getWidth(), this.getHeight());
      this.viewport = new Rectangle(0, 0, size, size);
      this.engine.setScene(this.getScene());
      this.engine.setViewport(this.viewport);
      this.engine.start();
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      this.engine.render(dt, x, y);
      _get(Game.prototype.__proto__ || Object.getPrototypeOf(Game.prototype), 'render', this).call(this, dt, x, y);
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(event) {
      this.sendEngineInput(_InputType2.default.ADD_PIECE, this.toAngle(event.x, event.y));
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(event) {
      //
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(event) {
      this.sendEngineInput(_InputType2.default.MOVE_CURSOR, this.toAngle(event.x, event.y));
    }
  }, {
    key: 'handleTouchStart',
    value: function handleTouchStart(event) {
      this.sendEngineInput(_InputType2.default.MOVE_CURSOR, this.toAngle(event.x, event.y));
    }
  }, {
    key: 'handleTouchEnd',
    value: function handleTouchEnd(event) {
      this.sendEngineInput(_InputType2.default.ADD_PIECE, this.toAngle(event.x, event.y));
    }
  }, {
    key: 'handleTouchMove',
    value: function handleTouchMove(event) {
      this.sendEngineInput(_InputType2.default.MOVE_CURSOR, this.toAngle(event.x, event.y));
    }
  }, {
    key: 'toAngle',
    value: function toAngle(x, y) {
      x = x - (this.viewport.x + this.viewport.w / 2);
      y = this.viewport.y + this.viewport.h / 2 - y;
      var a = Math.atan2(y, x);
      if (a < 0) a += 2 * Math.PI;
      return a;
    }
  }, {
    key: 'sendEngineInput',
    value: function sendEngineInput(type, data) {
      this.engine.dispatchEvent(new _EngineEvent2.default(_EngineEvent2.default.INPUT, null, null, { type: type, data: data }));
    }
  }]);

  return Game;
}(_BaseView3.default);

exports.default = Game;

},{"app/display/BaseView":52,"app/display/component/MainMenuButton":57,"app/display/game/Bat":58,"app/display/game/ComboMeter":59,"app/display/game/GameFail":60,"app/display/game/GameTimer":62,"app/display/game/GameUiHorz":63,"app/display/game/GameUiVert":64,"app/display/game/GameWin":65,"app/display/game/MatchesCounter":66,"app/engine/enum/ComponentType":81,"app/engine/enum/InputType":84,"app/event/EngineEvent":95,"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseView2 = require('app/display/BaseView');

var _BaseView3 = _interopRequireDefault(_BaseView2);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

var _MainMenuButton = require('app/display/component/MainMenuButton');

var _MainMenuButton2 = _interopRequireDefault(_MainMenuButton);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonEvent = _minibot2.default.event.ButtonEvent,
    Rect = _minibot2.default.display.scene.Rect,
    Color = _minibot2.default.graphics.Color,
    Utils = _minibot2.default.core.Utils;

var Options = function (_BaseView) {
    _inherits(Options, _BaseView);

    // backBtn: null,

    function Options(data) {
        _classCallCheck(this, Options);

        var _this = _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).call(this, data));

        var rect = new Rect(_this.w, _this.h, "", Color.FromHex("#1D96FE"));
        _this.addChild(rect);

        var button1 = new _MainMenuButton2.default("BACK HI (1)", _this.w * 0.8, _this.h * 0.1);
        _this.addChild(button1);
        button1.x = _this.w * 0.1;
        button1.y = _this.h * 0.1;
        button1.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleBackSelect, _this));

        var button2 = new _MainMenuButton2.default("BACK (2)", _this.w * 0.8, _this.h * 0.1);
        _this.addChild(button2);
        button2.x = _this.w * 0.1;
        button2.y = _this.h * 0.2 + button2.h * 1;
        button2.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleBackSelect, _this));

        var button3 = new _MainMenuButton2.default("BACK (3)", _this.w * 0.8, _this.h * 0.1);
        _this.addChild(button3);
        button3.x = _this.w * 0.1;
        button3.y = _this.h * 0.3 + button3.h * 2;
        button3.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleBackSelect, _this));

        return _this;
    }

    _createClass(Options, [{
        key: 'handleBackSelect',
        value: function handleBackSelect(event) {
            var viewEvent = new _ViewEvent2.default(_ViewEvent2.default.BACK_SELECTED);
            this.dispatchEvent(viewEvent);
        }
    }]);

    return Options;
}(_BaseView3.default);

exports.default = Options;

},{"app/display/BaseView":52,"app/display/component/MainMenuButton":57,"app/event/ViewEvent":96,"minibot":"minibot"}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Shell = function () {

  // scene: null,

  // currentView: null,

  function Shell(scene) {
    _classCallCheck(this, Shell);

    this.scene = scene;
  }

  _createClass(Shell, [{
    key: 'addChild',
    value: function addChild(view) {
      if (this.currentView == null) {
        this.scene.addChild(view);
        this.currentView = view;
      } else {

        // TODO: Add code to transition the current view out and load the new view in...
        // perhaps some cool canvas effect?? YES, try to use purple meta balls in a canvas to
        // fill the screen randomly, then pop them off the screen. maybe like a 0.5 second animation
        this.scene.removeChild(this.currentView);
        this.currentView = view;
        this.scene.addChild(view);
      }

      // This should already be done in BaseView
      //this.currentView.setWidth(this.scene.getWidth());
      //this.currentView.setHeight(this.scene.getHeight());
    }
  }]);

  return Shell;
}();

exports.default = Shell;

},{"minibot":"minibot"}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseView2 = require('app/display/BaseView');

var _BaseView3 = _interopRequireDefault(_BaseView2);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

var _MainMenuButton = require('app/display/component/MainMenuButton');

var _MainMenuButton2 = _interopRequireDefault(_MainMenuButton);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonEvent = _minibot2.default.event.ButtonEvent,
    DisplayObject = _minibot2.default.display.DisplayObject,
    Sprite = _minibot2.default.display.scene.Sprite,
    Rect = _minibot2.default.display.scene.Rect,
    Container = _minibot2.default.display.scene.Container,
    Color = _minibot2.default.graphics.Color,
    Utils = _minibot2.default.core.Utils;

var Title = function (_BaseView) {
    _inherits(Title, _BaseView);

    function Title(data) {
        _classCallCheck(this, Title);

        var _this = _possibleConstructorReturn(this, (Title.__proto__ || Object.getPrototypeOf(Title)).call(this, data));

        var rect = new Rect(_this.w, _this.h, "", Color.FromHex("#CCCCCC"));
        _this.addChild(rect);

        var buttonExit = new _MainMenuButton2.default("x", _this.w * 0.1, _this.h * 0.2);
        _this.addChild(buttonExit);
        buttonExit.x = _this.w * 0.8;
        buttonExit.y = _this.h * 0.1;
        buttonExit.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleExitSelect, _this));

        var button1 = new _MainMenuButton2.default("LEVEL 1", _this.w * 0.6, _this.h * 0.2);
        _this.addChild(button1);
        button1.x = _this.w * 0.1;
        button1.y = _this.h * 0.1;
        button1.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleLevelSelect, _this, 1));

        var button1 = new _MainMenuButton2.default("LEVEL 1", _this.w * 0.6, _this.h * 0.2);
        _this.addChild(button1);
        button1.x = _this.w * 0.1;
        button1.y = _this.h * 0.1;
        button1.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleLevelSelect, _this, 1));

        var button2 = new _MainMenuButton2.default("LEVEL 2", _this.w * 0.6, _this.h * 0.2);
        _this.addChild(button2);
        button2.x = _this.w * 0.1;
        button2.y = _this.h * 0.2 + button2.h * 1;
        button2.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleLevelSelect, _this, 2));

        var button3 = new _MainMenuButton2.default("LEVEL 3", _this.w * 0.6, _this.h * 0.2);
        _this.addChild(button3);
        button3.x = _this.w * 0.1;
        button3.y = _this.h * 0.3 + button3.h * 2;
        button3.addEventListener(ButtonEvent.SELECT, Utils.BindAsEventListener(_this.handleLevelSelect, _this, 3));

        return _this;
    }

    _createClass(Title, [{
        key: 'handleLevelSelect',
        value: function handleLevelSelect(event, level) {
            console.log('Title:handleLevelSelect - ' + level);
            var viewEvent = new _ViewEvent2.default(_ViewEvent2.default.LEVEL_SELECTED, level);
            this.dispatchEvent(viewEvent);
        }
    }, {
        key: 'handleExitSelect',
        value: function handleExitSelect(event) {
            var viewEvent = new _ViewEvent2.default(_ViewEvent2.default.EXIT_SELECTED);
            this.dispatchEvent(viewEvent);
        }
    }]);

    return Title;
}(_BaseView3.default);

DisplayObject.AddResource(Title, _ResourceType2.default.SPRITE, 'ui.title.bg');

exports.default = Title;

},{"app/display/BaseView":52,"app/display/component/MainMenuButton":57,"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _minibot = require("minibot");

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = _minibot2.default.display.scene.Button,
    Text = _minibot2.default.display.scene.Text,
    TextStyle = _minibot2.default.display.scene.TextStyle,
    Rect = _minibot2.default.display.scene.Rect,
    Color = _minibot2.default.graphics.Color,
    Container = _minibot2.default.display.scene.Container;

var MainMenuButton = function (_Button) {
    _inherits(MainMenuButton, _Button);

    function MainMenuButton(text, w, h) {
        _classCallCheck(this, MainMenuButton);

        var style = new TextStyle("monospace", h * 0.70, new Color(Color.RGB, 0, 0, 0), "center", "900");

        var upText = new Text(text, style);
        upText.x = w * 0.5;
        upText.y = h * 0.8;
        var overText = new Text(text, style);
        overText.x = w * 0.5;
        overText.y = h * 0.8;
        var downText = new Text(text, style);
        downText.x = w * 0.5;
        downText.y = h * 0.8;

        var upRect = new Rect(w, h, "", Color.FromHex("#990000"));
        var overRect = new Rect(w, h, "", Color.FromHex("#CC0000"));
        var downRect = new Rect(w, h, "", Color.FromHex("#660000"));

        var upContainer = new Container();
        upContainer.addChild(upRect);
        upContainer.addChild(upText);

        var overContainer = new Container();
        overContainer.addChild(overRect);
        overContainer.addChild(overText);

        var downContainer = new Container();
        downContainer.addChild(downRect);
        downContainer.addChild(downText);

        return _possibleConstructorReturn(this, (MainMenuButton.__proto__ || Object.getPrototypeOf(MainMenuButton)).call(this, upContainer, downContainer, overContainer));
    }

    return MainMenuButton;
}(Button);

exports.default = MainMenuButton;

},{"minibot":"minibot"}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bat = function (_minibot$display$scen) {
    _inherits(Bat, _minibot$display$scen);

    // body: null,
    // leftWing: null,
    // rightWing: null,

    function Bat(gameSize) {
        _classCallCheck(this, Bat);

        var _this = _possibleConstructorReturn(this, (Bat.__proto__ || Object.getPrototypeOf(Bat)).call(this));

        var ratio = gameSize / 5 / 400;

        _this.leftWing = new Sprite(DisplayObject.GetResource(Bat, _ResourceType2.default.SPRITE, 'ui.game.bat.wing_1l'));
        _this.leftWing.w *= ratio;
        _this.leftWing.h *= ratio;
        _this.leftWing.x -= 50 * ratio;
        _this.leftWing.y += 25 * ratio;
        _this.addChild(_this.leftWing);

        _this.rightWing = new Sprite(DisplayObject.GetResource(Bat, _ResourceType2.default.SPRITE, 'ui.game.bat.wing_1r'));
        _this.rightWing.w *= ratio;
        _this.rightWing.h *= ratio;
        _this.rightWing.x += 75 * ratio;
        _this.rightWing.y += 25 * ratio;
        _this.addChild(_this.rightWing);

        _this.body = new Sprite(DisplayObject.GetResource(Bat, _ResourceType2.default.SPRITE, 'ui.game.bat.body'));
        _this.body.w *= ratio;
        _this.body.h *= ratio;
        _this.addChild(_this.body);

        _this.body.x -= _this.body.w / 2;
        _this.body.y -= _this.body.h / 2;

        _this.leftWing.x -= _this.body.w / 2;
        _this.leftWing.y -= _this.body.h / 2;

        _this.rightWing.x -= _this.body.w / 2;
        _this.rightWing.y -= _this.body.h / 2;

        return _this;
    }

    return Bat;
}(_minibot2.default.display.scene.Container);

exports.default = Bat;

},{"app/resource/ResourceType":102,"minibot":"minibot"}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComboMeter = function (_minibot$display$scen) {
  _inherits(ComboMeter, _minibot$display$scen);

  // length: null,
  // position: null,
  // count: null,
  // comboText: null,

  function ComboMeter(width, height, length) {
    _classCallCheck(this, ComboMeter);

    var _this = _possibleConstructorReturn(this, (ComboMeter.__proto__ || Object.getPrototypeOf(ComboMeter)).call(this));

    _this.length = length;
    _this.position = 0;
    _this.count = 0;

    var style = new TextStyle("proxima-nova", 10, new Color(Color.RGB, 0, 0, 0), "left", "800");
    _this.comboText = new Text("", style);
    _this.comboText.hide();
    _this.comboText.y = 18;
    _this.addChild(_this.comboText);
    return _this;
  }

  _createClass(ComboMeter, [{
    key: 'handleComboUpdate',
    value: function handleComboUpdate(value, count) {
      this.position = value;
      this.count = count;
      if (count == 0) {
        this.comboText.hide();
      } else {
        this.comboText.show();
        this.comboText.setText("x" + count);
      }
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      _get(ComboMeter.prototype.__proto__ || Object.getPrototypeOf(ComboMeter.prototype), 'render', this).call(this, dt, x, y);
      for (var i = 0; i < this.length; i++) {
        if (i < this.position) {
          this.scene.setFillColor(Color.FromHex('#00AAAA'));
          this.scene.drawRect('', x + this.x + 10 * i, y + this.y, 8, 8);
        } else {
          this.scene.setFillColor(Color.FromHex('#000000'));
          this.scene.drawRect('', x + this.x + 10 * i, y + this.y, 8, 8);
        }
      }
    }
  }]);

  return ComboMeter;
}(_minibot2.default.display.scene.Container);

exports.default = ComboMeter;

},{"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameFail = function (_minibot$display$scen) {
  _inherits(GameFail, _minibot$display$scen);

  // fail: null,

  // t_b: null,
  // t_c: null,
  // t_t: null,

  // showing: null,

  function GameFail(size) {
    _classCallCheck(this, GameFail);

    var _this = _possibleConstructorReturn(this, (GameFail.__proto__ || Object.getPrototypeOf(GameFail)).call(this));

    _this.fail = new Sprite(DisplayObject.GetResource(GameFail, _ResourceType2.default.SPRITE, 'ui.game.fail'));

    var r = size / _this.fail.w * 0.9;
    _this.fail.w *= r;
    _this.fail.h *= r;
    _this.addChild(_this.fail);

    _this.y -= _this.h;
    _this.x = (size - _this.w) / 2;

    _this.showing = false;

    _this.t_t = 0;
    _this.t_b = 0;
    _this.t_c = _this.h + size / 2;

    _this.final = _this.t_c - _this.h;

    return _this;
  }

  _createClass(GameFail, [{
    key: 'show',
    value: function show() {
      this.showing = true;
    }
  }, {
    key: 'tween',
    value: function tween(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      if (this.showing) {
        this.t_t += dt;
        this.y = this.tween(this.t_t, this.t_b, this.t_c, 1000) - this.h;
        if (this.y >= this.final) {
          this.showing = false;
          this.y = this.final;
        }
      }
      _get(GameFail.prototype.__proto__ || Object.getPrototypeOf(GameFail.prototype), 'render', this).call(this, dt, x, y);
    }
  }]);

  return GameFail;
}(_minibot2.default.display.scene.Container);

exports.default = GameFail;

},{"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _minibot = require("minibot");

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameMenuButton = function (_minibot$display$scen) {
    _inherits(GameMenuButton, _minibot$display$scen);

    function GameMenuButton(text, w, h) {
        _classCallCheck(this, GameMenuButton);

        var style = new TextStyle("proxima-nova", h * 0.70, new Color(Color.RGB, 0, 0, 0), "center", "900");

        var upText = new Text(text, style);
        upText.x = w * 0.5;
        upText.y = h * 0.8;
        var overText = new Text(text, style);
        overText.x = w * 0.5;
        overText.y = h * 0.8;
        var downText = new Text(text, style);
        downText.x = w * 0.5;
        downText.y = h * 0.8;

        var upRect = new Rect(w, h, "", Color.FromHex("#990000"));
        var overRect = new Rect(w, h, "", Color.FromHex("#CC0000"));
        var downRect = new Rect(w, h, "", Color.FromHex("#0000CC"));

        var upContainer = new Container();
        upContainer.addChild(upRect);
        upContainer.addChild(upText);

        var overContainer = new Container();
        overContainer.addChild(overRect);
        overContainer.addChild(overText);

        var downContainer = new Container();
        downContainer.addChild(downRect);
        downContainer.addChild(downText);

        var _this = _possibleConstructorReturn(this, (GameMenuButton.__proto__ || Object.getPrototypeOf(GameMenuButton)).call(this, upContainer, downContainer, overContainer));

        _this.addEventListener(MouseEvent.MOUSE_UP, function () {});
        return _this;
    }

    return GameMenuButton;
}(_minibot2.default.display.scene.Button);

exports.default = GameMenuButton;

},{"minibot":"minibot"}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameTimer = function (_minibot$display$scen) {
  _inherits(GameTimer, _minibot$display$scen);

  // length: null,
  // position: null,

  // ratio: null,

  // unit: null,

  function GameTimer(ratio, length) {
    _classCallCheck(this, GameTimer);

    var _this = _possibleConstructorReturn(this, (GameTimer.__proto__ || Object.getPrototypeOf(GameTimer)).call(this));

    _this.length = length;
    _this.position = length;
    _this.ratio = ratio;

    _this.unit = new Sprite(DisplayObject.GetResource(GameTimer, _ResourceType2.default.SPRITE, 'ui.game.timer_unit'));
    _this.unit.w *= ratio + 0.1;
    _this.unit.h *= ratio + 0.1;

    var bg = new Sprite(DisplayObject.GetResource(GameTimer, _ResourceType2.default.SPRITE, 'ui.game.bar.04'));
    bg.w *= ratio;
    bg.h *= ratio;
    _this.addChild(bg);

    return _this;
  }

  _createClass(GameTimer, [{
    key: 'handleDropTimerUpdate',
    value: function handleDropTimerUpdate(value) {
      this.position = value;
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      _get(GameTimer.prototype.__proto__ || Object.getPrototypeOf(GameTimer.prototype), 'render', this).call(this, dt, x, y);
      var dy = this.ratio * 3;
      for (var i = 0; i < this.length; i++) {
        var dx = this.ratio * (30 * i + 18);
        if (i < this.position) {
          this.scene.drawImage(this.unit.sprite.img, this.unit.sprite.x, //sx,
          this.unit.sprite.y, //sy,
          this.unit.sprite.w, //sw,
          this.unit.sprite.h, //sh,
          this.unit.x + x + this.x + dx, //dx,
          this.unit.y + y + this.y + dy, //dy,
          this.unit.w, //dw,
          this.unit.h //dh
          );
          //this.scene.setFillColor(Color.FromHex('#990000'));
          //this.scene.drawRect('', x + this.x + dx, y + this.y, 8, 8);
        } else {
          this.scene.setFillColor(Color.FromHex('#000000'));
          this.scene.drawRect('', x + this.x + dx, y + this.y, 8, 8);
        }
      }
    }
  }]);

  return GameTimer;
}(_minibot2.default.display.scene.Container);

exports.default = GameTimer;

},{"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rect = _minibot2.default.display.scene.Rect;
var TextStyle = _minibot2.default.display.scene.TextStyle;
var Text = _minibot2.default.display.scene.Text;
var Color = _minibot2.default.graphics.Color;

var GameUiHorz = function (_minibot$display$scen) {
  _inherits(GameUiHorz, _minibot$display$scen);

  function GameUiHorz(width, height, size, matches, ticks, score) {
    _classCallCheck(this, GameUiHorz);

    var _this = _possibleConstructorReturn(this, (GameUiHorz.__proto__ || Object.getPrototypeOf(GameUiHorz)).call(this));

    _this.setWidth(width);
    _this.setHeight(height);
    _this.resizable = false;

    _this.matches = matches;

    var bg = new Rect(_this.w, size, '');
    _this.addChild(bg);

    var style = new TextStyle("proxima-nova", 30, new Color(Color.RGB, 0, 0, 0), "left", "800");
    _this.text = new Text(matches, style);
    _this.text.y = 18;
    _this.addChild(_this.text);

    return _this;
  }

  _createClass(GameUiHorz, [{
    key: 'handleMatchUpdate',
    value: function handleMatchUpdate(value) {
      this.text.setText(value.toString());
    }
  }, {
    key: 'handleDropTimerUpdate',
    value: function handleDropTimerUpdate(value) {
      //this.gameTimer.handleDropTimerUpdate(value);
    }
  }, {
    key: 'handlePenaltyUpdate',
    value: function handlePenaltyUpdate(value) {
      //this.penaltyCount = value;
    }
  }, {
    key: 'handleMenuSelect',
    value: function handleMenuSelect(event) {
      console.log('handle menu');
    }
  }]);

  return GameUiHorz;
}(_minibot2.default.display.scene.Container);

exports.default = GameUiHorz;

},{"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

var _GameMenuButton = require('app/display/game/GameMenuButton');

var _GameMenuButton2 = _interopRequireDefault(_GameMenuButton);

var _GameTimer = require('./GameTimer');

var _GameTimer2 = _interopRequireDefault(_GameTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameUiVert = function (_minibot$display$scen) {
  _inherits(GameUiVert, _minibot$display$scen);

  // gameTimer: null,

  // candiesLeftText: null,

  // penaltyLength: null,
  // penaltyCount: null,
  // penaltyOn: null,
  // penaltyOff: null,

  // ratio: null,

  function GameUiVert(width, height, size, matches, ticks, score) {
    _classCallCheck(this, GameUiVert);

    var _this = _possibleConstructorReturn(this, (GameUiVert.__proto__ || Object.getPrototypeOf(GameUiVert)).call(this));

    _this.setWidth(width);
    _this.setHeight(height);
    _this.resizable = false;

    _this.matches = matches;

    _this.penaltyLength = 3;
    _this.penaltyCount = 0;

    var r = size * 3 / 4 / 280;
    _this.ratio = r;

    // BG
    var pSprite = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.tile'));
    pSprite.w *= r;
    pSprite.h *= r;
    var pPat = new Pattern(pSprite);
    var bg1 = new Rect(_this.w, size / 4, '', pPat);
    _this.addChild(bg1);
    var bg2 = new Rect(size * 3 / 4, _this.h, '', pPat);
    _this.addChild(bg2);
    bg2.x = _this.w - bg2.w;

    var vby = size / 4;
    while (vby < _this.h) {
      var vbSprite = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.border_vert_right'));
      vbSprite.w *= r;
      vbSprite.h *= r;
      vbSprite.x = _this.w - vbSprite.w - 35 * r;
      vbSprite.y = vby;
      _this.addChild(vbSprite);
      vby += vbSprite.h;
    }

    var hbx = _this.w - size * 3 / 4;
    while (hbx > 0) {
      var hbSprite = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.border_horz_top'));
      hbSprite.w *= r;
      hbSprite.h *= r;
      hbSprite.x = hbx - hbSprite.w;
      hbSprite.y = size / 4 - hbSprite.h + 35 * r;
      _this.addChild(hbSprite);
      hbx -= hbSprite.w;
    }

    _this.gameTimer = new _GameTimer2.default(r + 0.2, 16);
    _this.gameTimer.x = 100 * r;
    _this.gameTimer.y = 10 * r;
    _this.addChild(_this.gameTimer);

    var scoreBg = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.bar.01'));
    scoreBg.w *= r + 0.2;
    scoreBg.h *= r + 0.2;
    scoreBg.x = _this.w - scoreBg.w - 400 * r;
    scoreBg.y = 10 * r;
    _this.addChild(scoreBg);
    var scoreLabel = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.score'));
    scoreLabel.w *= r + 0.3;
    scoreLabel.h *= r + 0.3;
    scoreLabel.x = _this.w - scoreBg.w - 390 * r;
    scoreLabel.y = 14 * r;
    _this.addChild(scoreLabel);

    var candiesLeftBg = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.bar.03'));
    candiesLeftBg.w *= r + 0.2;
    candiesLeftBg.h *= r + 0.2;
    candiesLeftBg.x = _this.w - size * 3 / 8 - candiesLeftBg.w / 2;
    candiesLeftBg.y = 500 * r;
    _this.addChild(candiesLeftBg);
    var candiesLeftLabel = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.candies_left'));
    candiesLeftLabel.w *= r + 0.3;
    candiesLeftLabel.h *= r + 0.3;
    candiesLeftLabel.x = _this.w - size * 3 / 8 - candiesLeftBg.w / 2;
    candiesLeftLabel.y = 480 * r;
    _this.addChild(candiesLeftLabel);
    var style = new TextStyle("proxima-nova", 30, Color.FromHex("#FFDD55"), "center", "800");
    _this.candiesLeftText = new Text(matches, style);
    _this.candiesLeftText.x = _this.w - size * 3 / 8;
    _this.candiesLeftText.y = 500 * r + candiesLeftBg.h - 40 * r;
    _this.addChild(_this.candiesLeftText);

    var penaltyBg = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.bar.05'));
    penaltyBg.w *= r + 0.2;
    penaltyBg.h *= r + 0.2;
    penaltyBg.x = _this.w - size * 3 / 8 - penaltyBg.w / 2;
    penaltyBg.y = 800 * r;
    _this.addChild(penaltyBg);
    var penaltyLabel = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.penalty'));
    penaltyLabel.w *= r + 0.3;
    penaltyLabel.h *= r + 0.3;
    penaltyLabel.x = _this.w - size * 3 / 8 - penaltyBg.w / 2;
    penaltyLabel.y = 780 * r;
    _this.addChild(penaltyLabel);
    _this.penaltyOn = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.penalty.on'));
    _this.penaltyOn.w *= r + 0.3;
    _this.penaltyOn.h *= r + 0.3;
    _this.penaltyOn.x = penaltyBg.x + 30 * r;
    _this.penaltyOn.y = penaltyBg.y + 30 * r;
    _this.penaltyOff = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.penalty.off'));
    _this.penaltyOff.w *= r + 0.3;
    _this.penaltyOff.h *= r + 0.3;
    _this.penaltyOff.x = penaltyBg.x + 30 * r;
    _this.penaltyOff.y = penaltyBg.y + 30 * r;

    // Menu
    var menuButtonUp = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.menu.up'));
    menuButtonUp.w *= r + 0.5;
    menuButtonUp.h *= r + 0.5;
    var menuButtonDown = new Sprite(DisplayObject.GetResource(GameUiVert, _ResourceType2.default.SPRITE, 'ui.game.menu.down'));
    menuButtonDown.w *= r + 0.5;
    menuButtonDown.h *= r + 0.5;
    var menuButton = new Button(menuButtonUp, menuButtonDown, menuButtonDown);
    menuButton.x = _this.w - menuButton.w;
    menuButton.addEventListener(ButtonEvent.SELECT, _this.handleMenuSelect.bindAsEventListener(_this));
    menuButton.addEventListener(MouseEvent.MOUSE_UP, function () {});
    _this.addChild(menuButton);

    /*
    var button = new GameMenuButton('QUIT', size*3/4, size/4);
    button.x = this.w - size*3/4;
    button.y = this.h - 100;
    this.addChild(button);
    */

    return _this;
  }

  _createClass(GameUiVert, [{
    key: 'render',
    value: function render(dt, x, y) {
      _get(GameUiVert.prototype.__proto__ || Object.getPrototypeOf(GameUiVert.prototype), 'render', this).call(this, dt, x, y);

      var dx = 0,
          dy = 0;

      for (var i = 0; i < this.penaltyLength; i++) {
        dy = i * 80 * this.ratio;
        if (i < this.penaltyCount) {
          this.scene.drawImage(this.penaltyOn.sprite.img, this.penaltyOn.sprite.x, //sx,
          this.penaltyOn.sprite.y, //sy,
          this.penaltyOn.sprite.w, //sw,
          this.penaltyOn.sprite.h, //sh,
          this.penaltyOn.x + x + this.x + dx, //dx,
          this.penaltyOn.y + y + this.y + dy, //dy,
          this.penaltyOn.w, //dw,
          this.penaltyOn.h //dh
          );
        } else {
          this.scene.drawImage(this.penaltyOff.sprite.img, this.penaltyOff.sprite.x, //sx,
          this.penaltyOff.sprite.y, //sy,
          this.penaltyOff.sprite.w, //sw,
          this.penaltyOff.sprite.h, //sh,
          this.penaltyOff.x + x + this.x + dx, //dx,
          this.penaltyOff.y + y + this.y + dy, //dy,
          this.penaltyOff.w, //dw,
          this.penaltyOff.h //dh
          );
        }
      }
    }
  }, {
    key: 'handleMatchUpdate',
    value: function handleMatchUpdate(value) {
      this.candiesLeftText.setText(value.toString());
    }
  }, {
    key: 'handleDropTimerUpdate',
    value: function handleDropTimerUpdate(value) {
      this.gameTimer.handleDropTimerUpdate(value);
    }
  }, {
    key: 'handlePenaltyUpdate',
    value: function handlePenaltyUpdate(value) {
      this.penaltyCount = value;
    }
  }, {
    key: 'handleMenuSelect',
    value: function handleMenuSelect(event) {
      console.log('handle menu');
    }
  }]);

  return GameUiVert;
}(_minibot2.default.display.scene.Container);

exports.default = GameUiVert;

},{"./GameTimer":62,"app/display/game/GameMenuButton":61,"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameWin = function (_minibot$display$scen) {
  _inherits(GameWin, _minibot$display$scen);

  // win: null,

  // t_b: null,
  // t_c: null,
  // t_t: null,

  // showing: null,

  function GameWin(size) {
    _classCallCheck(this, GameWin);

    var _this = _possibleConstructorReturn(this, (GameWin.__proto__ || Object.getPrototypeOf(GameWin)).call(this));

    _this.win = new Sprite(DisplayObject.GetResource(GameWin, _ResourceType2.default.SPRITE, 'ui.game.win'));

    var r = size / _this.win.w * 0.9;
    _this.win.w *= r;
    _this.win.h *= r;
    _this.addChild(_this.win);

    _this.y -= _this.h;
    _this.x = (size - _this.w) / 2;

    _this.showing = false;

    _this.t_t = 0;
    _this.t_b = 0;
    _this.t_c = _this.h + size / 2;

    _this.final = _this.t_c - _this.h;

    return _this;
  }

  _createClass(GameWin, [{
    key: 'show',
    value: function show() {
      this.showing = true;
    }
  }, {
    key: 'tween',
    value: function tween(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      if (this.showing) {
        this.t_t += dt;
        this.y = this.tween(this.t_t, this.t_b, this.t_c, 1000) - this.h;
        if (this.y >= this.final) {
          this.showing = false;
          this.y = this.final;
        }
      }
      _get(GameWin.prototype.__proto__ || Object.getPrototypeOf(GameWin.prototype), 'render', this).call(this, dt, x, y);
    }
  }]);

  return GameWin;
}(_minibot2.default.display.scene.Container);

exports.default = GameWin;

},{"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MatchesCounter = function (_minibot$display$scen) {
  _inherits(MatchesCounter, _minibot$display$scen);

  // matches: null,
  // text: null,

  function MatchesCounter(matches) {
    _classCallCheck(this, MatchesCounter);

    var _this = _possibleConstructorReturn(this, (MatchesCounter.__proto__ || Object.getPrototypeOf(MatchesCounter)).call(this));

    _this.matches = matches;

    var style = new TextStyle("proxima-nova", 30, new Color(Color.RGB, 0, 0, 0), "left", "800");
    _this.text = new Text(matches, style);
    _this.text.y = 18;
    _this.addChild(_this.text);

    return _this;
  }

  _createClass(MatchesCounter, [{
    key: 'handleMatchUpdate',
    value: function handleMatchUpdate(value) {
      this.text.setText(value.toString());
    }
  }]);

  return MatchesCounter;
}(_minibot2.default.display.scene.Container);

exports.default = MatchesCounter;

},{"app/event/ViewEvent":96,"app/resource/ResourceType":102,"minibot":"minibot"}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _GameObjectType = require('app/engine/enum/GameObjectType');

var _GameObjectType2 = _interopRequireDefault(_GameObjectType);

var _CandyType = require('app/engine/enum/CandyType');

var _CandyType2 = _interopRequireDefault(_CandyType);

var _InputSystem = require('app/engine/system/InputSystem');

var _InputSystem2 = _interopRequireDefault(_InputSystem);

var _LogicSystem = require('app/engine/system/LogicSystem');

var _LogicSystem2 = _interopRequireDefault(_LogicSystem);

var _GridSystem = require('app/engine/system/GridSystem');

var _GridSystem2 = _interopRequireDefault(_GridSystem);

var _PhysicsSystem = require('app/engine/system/PhysicsSystem');

var _PhysicsSystem2 = _interopRequireDefault(_PhysicsSystem);

var _DisplaySystem = require('app/engine/system/DisplaySystem');

var _DisplaySystem2 = _interopRequireDefault(_DisplaySystem);

var _SoundSystem = require('app/engine/system/SoundSystem');

var _SoundSystem2 = _interopRequireDefault(_SoundSystem);

var _ObjectFactory = require('app/engine/factory/ObjectFactory');

var _ObjectFactory2 = _interopRequireDefault(_ObjectFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Engine = function (_minibot$event$EventD) {
  _inherits(Engine, _minibot$event$EventD);

  // List of all systems
  // systems: null,

  // List of all systems by type
  // systemsByType: null,

  // List of all objects
  // objects: null,

  // List of objects by type
  // objectsByType: null,

  // The primary camera
  // scene: null,
  // viewport: null,

  // The resource map
  // resources: null,
  // resourcesLoaded: null,

  // flags
  // running: false,
  // lastTime: null,
  // thisTime: null,

  // MOVETHIS TO GRID SYSTEM?

  // list of candy types
  // candyTypes: null,


  function Engine(level) {
    _classCallCheck(this, Engine);

    // OVERRIDE
    var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this));

    level.level = 1;
    level.initialRows = 3;
    level.tickSpeed = 800;
    level.matches = 20;
    level.candyTypes = [_CandyType2.default.A, _CandyType2.default.B, _CandyType2.default.C, _CandyType2.default.D];

    _this.level = level;

    _this.resources = {};
    _this.resourcesLoaded = false;

    _this.systems = [];
    _this.systemsByType = {};
    _this.objects = [];
    _this.objectsByType = {};

    _this.inputQueue = [];

    // Set the candy types
    _this.candyTypes = _this.level.candyTypes;

    // Add the systems
    _this.addSystem(new _InputSystem2.default());
    _this.addSystem(new _LogicSystem2.default({
      tickSpeed: _this.level.tickSpeed,
      matches: _this.level.matches
    }));
    _this.addSystem(new _GridSystem2.default(_EngineConstants2.default.SECTIONS, _EngineConstants2.default.DEPTH));
    _this.addSystem(new _PhysicsSystem2.default());
    _this.addSystem(new _DisplaySystem2.default());
    _this.addSystem(new _SoundSystem2.default());
    //this.addSystem(new StatisticsSystem());

    // Add cursor
    var cursor = _ObjectFactory2.default.Create(_GameObjectType2.default.CURSOR);
    _this.addObject(cursor);

    // Add initial candies
    for (var y = 0; y < _this.level.initialRows; y++) {
      for (var x = 0; x < _EngineConstants2.default.SECTIONS; x++) {
        var candy = _ObjectFactory2.default.Create(_GameObjectType2.default.CANDY, {
          "candyType": _this.randomCandy(),
          "x": x,
          "y": y
        });
        _this.addObject(candy);
      }
    }

    for (var i = 0; i < _this.systems.length; i++) {
      _this.systems[i].onInitialized();
    }

    return _this;
  }

  _createClass(Engine, [{
    key: 'destroy',
    value: function destroy() {
      this.running = false;
      for (i = 0; i < this.objects.length; i++) {
        this.objects.destroy();
      }
      for (i = 0; i < this.systems.length; i++) {
        this.systems.destroy();
      }
      this.systems = null;
      this.objects = null;
      this.removeAllEventListeners();
    }
  }, {
    key: 'getResources',
    value: function getResources() {
      return this.resources;
    }
  }, {
    key: 'getResource',
    value: function getResource(type, id) {
      if (this.resources[type] == undefined) return null;
      if (this.resources[type][id] == undefined) return null;
      return this.resources[type][id];
    }
  }, {
    key: 'addResource',
    value: function addResource(type, id) {
      if (this.resources[type] == undefined) this.resources[type] = {};
      this.resources[type][id] = null;
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {
      this.resourcesLoaded = true;
      var i;
      for (i = 0; i < this.systems.length; i++) {
        this.systems[i].onResourcesLoaded();
      }
      for (i = 0; i < this.objects.length; i++) {
        this.objects[i].onResourcesLoaded();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      if (this.running) return;
      this.running = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.running = false;
      // Stop each sub system?
    }
  }, {
    key: 'update',
    value: function update(dt) {
      // Check if we are running
      if (!this.running) return;

      // Update the Systems in preset order
      for (var s = 0; s < Engine.UPDATE_ORDER.length; s++) {
        this.systemsByType[Engine.UPDATE_ORDER[s]].update(dt);
      }
    }
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      x += this.viewport.x;
      y += this.viewport.y;
      this.systemsByType[_ComponentType2.default.DISPLAY].render(dt, x, y);
    }
  }, {
    key: 'renderPhysics',
    value: function renderPhysics() {
      var object, component;
      for (var i = 0; i < this.objects.length; i++) {
        object = this.objects[i];
        if (!object.hasComponent(_ComponentType2.default.PHYSICS)) continue;
        component = object.getComponent(_ComponentType2.default.PHYSICS);
        component.render(this.context);
      }
    }
  }, {
    key: 'setScene',
    value: function setScene(scene) {
      this.scene = scene;
    }
  }, {
    key: 'setSoundProxy',
    value: function setSoundProxy(soundProxy) {
      this.systemsByType[_ComponentType2.default.SOUND].setSoundProxy(soundProxy);
    }
  }, {
    key: 'setViewport',
    value: function setViewport(viewport) {
      this.viewport = viewport;
      _EngineConstants2.default.R = viewport.w / _EngineConstants2.default.BASE_R;
    }
  }, {
    key: 'addObject',
    value: function addObject(obj) {
      // Add to objects
      this.objects.push(obj);

      // Add to objectsByType
      var type = obj.getType();
      if (this.objectsByType[type] == undefined) {
        this.objectsByType[type] = [];
      }
      this.objectsByType[type].push(obj);

      // Add to systems if component is available
      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].addObject(obj);
      }

      obj.setEngine(this);
      obj.onAddedToEngine();

      if (this.resourcesLoaded) {
        obj.onResourcesLoaded();
      }
    }
  }, {
    key: 'createObject',
    value: function createObject(type, data) {
      return _ObjectFactory2.default.Create(type, data);
    }
  }, {
    key: 'removeObject',
    value: function removeObject(obj) {
      var i = this.objects.indexOf(obj);
      if (i != -1) this.objects.splice(i, 1);

      var type = obj.getType();
      var arr = this.objectsByType[type];
      i = arr.indexOf(obj);
      if (i != -1) arr.splice(i, 1);

      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].removeObject(obj);
      }

      //obj.onRemovedFromEngine(this);
    }
  }, {
    key: 'addSystem',
    value: function addSystem(sys) {
      // Get type
      var type = sys.getType();
      if (this.systemsByType[type] != undefined) {
        // ERROR?
        return;
      }

      // Add to systems
      this.systems.push(sys);

      // Add to systemsByType
      this.systemsByType[type] = sys;

      sys.setEngine(this);
      sys.onAddedToEngine();
    }
  }, {
    key: 'getSystem',
    value: function getSystem(type) {
      return this.systemsByType[type];
    }
  }, {
    key: 'removeSystem',
    value: function removeSystem(sys) {}

    // +++++++++++++++++++++++++++++++++++++ REMOVE THESE FUNCTIONS!!

    /*
    // Input -->
      input(type, data)
    {
      this.inputQueue.push(
        {
    //       type: type,
          data: data
        }
      );
    }
      // <-- Input
      moveCursor(a)
    {
      this.cursorLocation = a;
        //var sec = Math.floor((this.cursorLocation + this.sectionAngle/2) / this.sectionAngle) % (this.sections*2);
      //if(sec != this.currentSection) {
      //  this.deleteFlagsOnSection(this.currentSection, GridFlags.SELECTED)
      //  this.setFlagsOnSection(sec, GridFlags.SELECTED);
      //
      //  this.currentSection = sec;
      //}
      }
      processInputQueue()
    {
      // test
      while(this.inputQueue.length) {
        var q = this.inputQueue.shift();
        while(this.inputQueue.length && this.inputQueue[0].type == q.type) {
          q = this.inputQueue.shift();
        }
        switch(q.type) {
          case Engine.INPUT_ADD_PIECE:
            this.addPiece(q.data);
            break;
          case Engine.INPUT_MOVE_CURSOR:
            this.moveCursor(q.data);
            break;
        }
      }
    },
    */

  }, {
    key: 'randomCandy',
    value: function randomCandy() {
      var i = Math.floor(Math.random() * this.candyTypes.length);
      return this.candyTypes[i];
    }
  }, {
    key: 'addPiece',
    value: function addPiece() {
      //if(this.isInserting) return;
      //this.isInserting = true;
      //this.insertLocation = a;


      var x = Math.floor(Math.random() * 8);
      var grid = this.systemsByType[_ComponentType2.default.GRID];
      for (var y = 0; y < _EngineConstants2.default.DEPTH; y++) {
        if (!grid.hasAt(x, y)) break;
      }

      var candy = _ObjectFactory2.default.Create(_GameObjectType2.default.CANDY, {
        "candyType": this.randomCandy(),
        "x": x,
        "y": y
      });
      this.addObject(candy);
    }
  }]);

  return Engine;
}(_minibot2.default.event.EventDispatcher);

Engine.UPDATE_ORDER = [];
Engine.UPDATE_ORDER.push(_ComponentType2.default.INPUT);
Engine.UPDATE_ORDER.push(_ComponentType2.default.LOGIC);
Engine.UPDATE_ORDER.push(_ComponentType2.default.GRID);
Engine.UPDATE_ORDER.push(_ComponentType2.default.PHYSICS);
Engine.UPDATE_ORDER.push(_ComponentType2.default.DISPLAY);
Engine.UPDATE_ORDER.push(_ComponentType2.default.SOUND);
//Engine.UPDATE_ORDER.push(ComponentType.STATISTICS);

exports.default = Engine;

},{"app/engine/EngineConstants":68,"app/engine/enum/CandyType":80,"app/engine/enum/ComponentType":81,"app/engine/enum/GameObjectType":82,"app/engine/factory/ObjectFactory":85,"app/engine/system/DisplaySystem":88,"app/engine/system/GridSystem":90,"app/engine/system/InputSystem":91,"app/engine/system/LogicSystem":92,"app/engine/system/PhysicsSystem":93,"app/engine/system/SoundSystem":94,"minibot":"minibot"}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EngineConstants = {};

// Grid constants
EngineConstants.SECTIONS = 8;
EngineConstants.DEPTH = 10;

// World constants
EngineConstants.SECTION_ANGLE = Math.PI / EngineConstants.SECTIONS;

// Screen constants
EngineConstants.Si = 20;
EngineConstants.A = 1.0;
EngineConstants.B = 6;
EngineConstants.C = 32;
EngineConstants.R = 800;
EngineConstants.BASE_R = 800;

EngineConstants.ScreenS = {};
EngineConstants.ScreenR = {};

EngineConstants.GridToWorldH = function (x, y) {
  return y;
};

EngineConstants.GridToWorldA = function (x, y) {
  return (2 * x + y) * EngineConstants.SECTION_ANGLE % (2 * Math.PI);
};

EngineConstants.WorldToScreenS = function (h) {
  if (EngineConstants.ScreenS[h] == undefined) {
    EngineConstants.ScreenS[h] = (EngineConstants.Si + Math.pow(h + 1, 2) / 2) * EngineConstants.R;
  }
  return EngineConstants.ScreenS[h];
};

EngineConstants.WorldToScreenR = function (h) {
  if (EngineConstants.ScreenR[h] == undefined) {
    EngineConstants.ScreenR[h] = (EngineConstants.C + h * EngineConstants.B + EngineConstants.A * Math.pow(h, 2)) * EngineConstants.R;
  }
  return EngineConstants.ScreenR[h];
};

EngineConstants.INPUT_ADD_PIECE = 1;
EngineConstants.INPUT_MOVE_CURSOR = 2;

exports.default = EngineConstants;

},{}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

var _DisplayComponent2 = require('app/engine/component/core/DisplayComponent');

var _DisplayComponent3 = _interopRequireDefault(_DisplayComponent2);

var _ComponentMessage = require('app/engine/component/core/ComponentMessage');

var _ComponentMessage2 = _interopRequireDefault(_ComponentMessage);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _Engine = require('app/engine/Engine');

var _Engine2 = _interopRequireDefault(_Engine);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _CandyType = require('app/engine/enum/CandyType');

var _CandyType2 = _interopRequireDefault(_CandyType);

var _GridFlag = require('app/engine/enum/GridFlag');

var _GridFlag2 = _interopRequireDefault(_GridFlag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandyDisplayComponent = function (_DisplayComponent) {
  _inherits(CandyDisplayComponent, _DisplayComponent);

  // sprite: null,

  // sprite_016: null,
  // sprite_032: null,
  // sprite_064: null,
  // sprite_128: null,

  function CandyDisplayComponent() {
    _classCallCheck(this, CandyDisplayComponent);

    return _possibleConstructorReturn(this, (CandyDisplayComponent.__proto__ || Object.getPrototypeOf(CandyDisplayComponent)).call(this));
  }

  _createClass(CandyDisplayComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {}
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {}
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {
      var id = "";
      switch (this.getProperty("candyType")) {
        case _CandyType2.default.A:
          id = "object.candy.01";
          break;
        case _CandyType2.default.B:
          id = "object.candy.02";
          break;
        case _CandyType2.default.C:
          id = "object.candy.03";
          break;
        case _CandyType2.default.D:
          id = "object.candy.04";
          break;
        case _CandyType2.default.E:
          id = "object.candy.05";
          break;
        case _CandyType2.default.F:
          id = "object.candy.06";
          break;
        case _CandyType2.default.G:
          id = "object.candy.07";
          break;
      }

      this.sprite = this.getResource(_ResourceType2.default.SPRITE, id);

      this.sprite_016 = this.getResource(_ResourceType2.default.SPRITE, id + ".016");
      this.sprite_032 = this.getResource(_ResourceType2.default.SPRITE, id + ".032");
      this.sprite_064 = this.getResource(_ResourceType2.default.SPRITE, id + ".064");
      this.sprite_128 = this.getResource(_ResourceType2.default.SPRITE, id + ".128");
    }
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render(dt, x, y) {

      var zoom = 10 - this.system.getZoomLevel();
      var viewport = this.system.getViewport();
      var scene = this.system.getScene();

      var a = this.getProperty("a");
      var h = this.getProperty("h") + zoom;

      var s = _EngineConstants2.default.WorldToScreenS(h);
      var r = _EngineConstants2.default.WorldToScreenR(h);

      var selected = (this.getProperty("flags") >> _GridFlag2.default.SELECTED) % 2 != 0;
      if (selected) s *= 1.2;

      x += viewport.w / 2 + r * Math.cos(a) - s / 2;
      y += viewport.h / 2 - r * Math.sin(a) - s / 2;

      var sprite = this.sprite;
      if (s <= 16) {
        //sprite = this.sprite_016
      } else if (s <= 32) {
        //sprite = this.sprite_032
      } else if (s <= 64) {
        //sprite = this.sprite_064
      } else if (s <= 128) {
        //sprite = this.sprite_128
      }

      scene.drawImage(sprite.img, sprite.x, //sx,
      sprite.y, //sy,
      sprite.w, //sw,
      sprite.h, //sh,
      x, //dx,
      y, //dy,
      s, //dw,
      s //dh
      );
    }
  }]);

  return CandyDisplayComponent;
}(_DisplayComponent3.default);

exports.default = CandyDisplayComponent;

},{"app/engine/Engine":67,"app/engine/EngineConstants":68,"app/engine/component/core/ComponentMessage":72,"app/engine/component/core/DisplayComponent":73,"app/engine/enum/CandyType":80,"app/engine/enum/ComponentType":81,"app/engine/enum/GridFlag":83,"app/resource/ResourceType":102,"minibot":"minibot"}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GridSystem = require('app/engine/system/GridSystem');

var _GridSystem2 = _interopRequireDefault(_GridSystem);

var _GridComponent2 = require('app/engine/component/core/GridComponent');

var _GridComponent3 = _interopRequireDefault(_GridComponent2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _EngineComponent = require('app/engine/component/core/EngineComponent');

var _EngineComponent2 = _interopRequireDefault(_EngineComponent);

var _SigSlt = require('app/engine/message/SigSlt');

var _SigSlt2 = _interopRequireDefault(_SigSlt);

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandyGridComponent = function (_GridComponent) {
  _inherits(CandyGridComponent, _GridComponent);

  function CandyGridComponent() {
    _classCallCheck(this, CandyGridComponent);

    return _possibleConstructorReturn(this, (CandyGridComponent.__proto__ || Object.getPrototypeOf(CandyGridComponent)).call(this));
  }

  _createClass(CandyGridComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      _get(CandyGridComponent.prototype.__proto__ || Object.getPrototypeOf(CandyGridComponent.prototype), 'onAddedToObject', this).call(this);

      if (this.hasProperty('fromCursor')) {
        _SigSlt2.default.AddSlot(this, _EngineComponent2.default.SLT_CANDY_SHOT_END, this.candyShotEnd);
      }

      _SigSlt2.default.AddSlot(this, _EngineComponent2.default.SLT_CANDY_DROP_END, this.candyDropEnd);
      _SigSlt2.default.AddSignal(this, _EngineComponent2.default.SIG_CANDY_DROP_START);
      _SigSlt2.default.AddSignal(this, _EngineComponent2.default.SIG_CANDY_MATCH);
      _SigSlt2.default.AddSignal(this, _EngineComponent2.default.SIG_CANDY_NONMATCH);
    }
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {
      if (this.hasProperty('fromCursor')) {
        this.connect(_ComponentType2.default.PHYSICS, _EngineComponent2.default.SIG_CANDY_SHOT_END, _EngineComponent2.default.SLT_CANDY_SHOT_END);
      }
      this.connect(_ComponentType2.default.PHYSICS, _EngineComponent2.default.SIG_CANDY_DROP_END, _EngineComponent2.default.SLT_CANDY_DROP_END);
    }
  }, {
    key: 'candyShotEnd',
    value: function candyShotEnd(c) {
      var h = this.getProperty('h');
      var a = this.getProperty('a');

      var x = _EngineConstants2.default.WorldToGridX(a, h);
      var y = _EngineConstants2.default.WorldToGridY(a, h);

      this.setProperty("h", _EngineConstants2.default.GridToWorldH(x, y));
      this.setProperty("a", _EngineConstants2.default.GridToWorldA(x, y));
      this.setProperty("x", x);
      this.setProperty("y", y);

      this.system.setAt(x, y, this);

      var matches = this.system.getMatches(x, y, function (objA, objB) {
        return objA.getProperty("candyType") == objB.getProperty("candyType");
      });
      if (matches.length >= 3) {

        _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_MATCH, matches);

        for (var i = 0; i < matches.length; i++) {
          matches[i].matched();
        }
      } else {
        console.log("NO MATCH");
        _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_NONMATCH, matches);
      }

      this.system.findMaxDepth();
    }
  }, {
    key: 'candyDropEnd',
    value: function candyDropEnd(c) {
      var h = this.getProperty('h');
      var a = this.getProperty('a');

      var x = _EngineConstants2.default.WorldToGridX(a, h);
      var y = _EngineConstants2.default.WorldToGridY(a, h);

      this.setProperty("h", _EngineConstants2.default.GridToWorldH(x, y));
      this.setProperty("a", _EngineConstants2.default.GridToWorldA(x, y));
      this.setProperty("x", x);
      this.setProperty("y", y);

      this.system.setAt(x, y, this);
      this.system.findMaxDepth();
    }
  }, {
    key: 'matched',
    value: function matched() {
      var x = this.getProperty("x");
      var y = this.getProperty("y");
      var o = this.object;
      var s = this.system;
      s.engine.removeObject(o);
      s.fallPiecesAt(x, y);
    }
  }, {
    key: 'drop',
    value: function drop() {
      var x = this.getProperty("x");
      var y = this.getProperty("y");
      this.setProperty("sec", _EngineConstants2.default.GridToWorldSec(x, y));
      this.system.deleteAt(x, y);
      _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_DROP_START, this);
    }
  }]);

  return CandyGridComponent;
}(_GridComponent3.default);

exports.default = CandyGridComponent;

},{"app/engine/EngineConstants":68,"app/engine/component/core/EngineComponent":74,"app/engine/component/core/GridComponent":75,"app/engine/enum/ComponentType":81,"app/engine/message/SigSlt":86,"app/engine/system/GridSystem":90}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GridSystem = require('app/engine/system/GridSystem');

var _GridSystem2 = _interopRequireDefault(_GridSystem);

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _GameObjectType = require('app/engine/enum/GameObjectType');

var _GameObjectType2 = _interopRequireDefault(_GameObjectType);

var _EngineComponent = require('app/engine/component/core/EngineComponent');

var _EngineComponent2 = _interopRequireDefault(_EngineComponent);

var _PhysicsComponent2 = require('app/engine/component/core/PhysicsComponent');

var _PhysicsComponent3 = _interopRequireDefault(_PhysicsComponent2);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _SigSlt = require('app/engine/message/SigSlt');

var _SigSlt2 = _interopRequireDefault(_SigSlt);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandyPhysicsComponent = function (_PhysicsComponent) {
  _inherits(CandyPhysicsComponent, _PhysicsComponent);

  // dropping: null,

  // shooting: null,
  // shootingSection: null,

  function CandyPhysicsComponent() {
    _classCallCheck(this, CandyPhysicsComponent);

    var _this = _possibleConstructorReturn(this, (CandyPhysicsComponent.__proto__ || Object.getPrototypeOf(CandyPhysicsComponent)).call(this));

    _this.shooting = false;
    _this.dropping = false;
    return _this;
  }

  _createClass(CandyPhysicsComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      if (this.hasProperty('fromCursor')) {
        this.shooting = true;
        this.shootingSection = this.getProperty('sec');
        _SigSlt2.default.AddSignal(this, _EngineComponent2.default.SIG_CANDY_SHOT_END);
      }

      _SigSlt2.default.AddSignal(this, _EngineComponent2.default.SIG_CANDY_DROP_END);
      _SigSlt2.default.AddSlot(this, _EngineComponent2.default.SLT_CANDY_DROP_START, this.candyDropStart);
    }
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {}
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {
      this.connect(_ComponentType2.default.GRID, _EngineComponent2.default.SIG_CANDY_DROP_START, _EngineComponent2.default.SLT_CANDY_DROP_START);
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {}
  }, {
    key: 'update',
    value: function update(dt) {
      if (this.shooting) {
        var h = this.getProperty('h');
        h -= dt / 40;
        this.setProperty('h', h);
        var sec = this.getProperty('sec');

        if (h <= sec % 2) {
          this.shooting = false;
          this.setProperty('h', sec % 2);
          _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_SHOT_END, this);
        } else {
          var gridSystem = this.system.engine.getSystem(_ComponentType2.default.GRID);
          gridSystem.iterateBySection(this.shootingSection, function (x, y) {
            if (gridSystem.hasAt(x, y)) {
              var t = _EngineConstants2.default.GridToWorldH(x, y) + 2;
              if (h <= t) {
                this.shooting = false;
                this.setProperty('h', t);
                _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_SHOT_END, this);
                throw _GridSystem2.default.$break;
              }
            }
          }.bind(this));
        }
      } else if (this.dropping) {
        var h = this.getProperty('h');
        h -= dt / 80;
        this.setProperty('h', h);
        var sec = this.getProperty('sec');

        if (h <= sec % 2) {
          this.dropping = false;
          this.setProperty('h', sec % 2);
          _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_DROP_END, this);
        } else {
          var gridSystem = this.system.engine.getSystem(_ComponentType2.default.GRID);
          gridSystem.iterateBySection(sec, function (x, y) {
            if (gridSystem.hasAt(x, y)) {
              var t = _EngineConstants2.default.GridToWorldH(x, y) + 2;
              if (h <= t) {
                this.dropping = false;
                this.setProperty('h', t);
                _SigSlt2.default.Emit(this, _EngineComponent2.default.SIG_CANDY_DROP_END, this);
                throw _GridSystem2.default.$break;
              }
            }
          }.bind(this));
        }
      }
    }
  }, {
    key: 'candyDropStart',
    value: function candyDropStart() {
      console.log("DROPPING");
      this.dropping = true;
    }
  }]);

  return CandyPhysicsComponent;
}(_PhysicsComponent3.default);

exports.default = CandyPhysicsComponent;

},{"app/engine/EngineConstants":68,"app/engine/component/core/EngineComponent":74,"app/engine/component/core/PhysicsComponent":76,"app/engine/enum/ComponentType":81,"app/engine/enum/GameObjectType":82,"app/engine/message/SigSlt":86,"app/engine/system/GridSystem":90,"app/event/EngineEvent":95,"minibot":"minibot"}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentMessage =

// type: null,

// data: null,

function ComponentMessage(type, data) {
  _classCallCheck(this, ComponentMessage);

  if (!data) data = {};
  this.type = type;
  this.data = data;
};

exports.default = ComponentMessage;

},{}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineComponent2 = require('app/engine/component/core/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayComponent = function (_EngineComponent) {
  _inherits(DisplayComponent, _EngineComponent);

  function DisplayComponent() {
    _classCallCheck(this, DisplayComponent);

    return _possibleConstructorReturn(this, (DisplayComponent.__proto__ || Object.getPrototypeOf(DisplayComponent)).call(this, _ComponentType2.default.DISPLAY));
  }

  _createClass(DisplayComponent, [{
    key: 'getLayers',
    value: function getLayers() {
      return [0];
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return true;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      //-- OVERRIDE
    }
  }, {
    key: 'render',
    value: function render() {
      //-- OVERRIDE
    }
  }]);

  return DisplayComponent;
}(_EngineComponent3.default);

exports.default = DisplayComponent;

},{"app/engine/component/core/EngineComponent":74,"app/engine/enum/ComponentType":81}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SigSlt = require('app/engine/message/SigSlt');

var _SigSlt2 = _interopRequireDefault(_SigSlt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EngineComponent = function () {

  // type: null,

  // object: null,

  // system: null,

  // listeners: null,

  // signals: null,

  function EngineComponent(type) {
    _classCallCheck(this, EngineComponent);

    this.type = type;

    this.listeners = {};
    this.signals = {};
    this.slots = {};
  }

  _createClass(EngineComponent, [{
    key: 'destroy',
    value: function destroy() {
      for (var i = 0; i < this.signals.length; i++) {
        this.signals[i].disconnect_all();
      }
      this.signals = null;
      this.slots = null;
      this.listeners = null;
      this.system = null;
      this.object = null;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'setProperty',
    value: function setProperty(key, value) {
      this.object.setProperty(key, value);
    }
  }, {
    key: 'getProperty',
    value: function getProperty(key) {
      return this.object.getProperty(key);
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(key) {
      return this.object.hasProperty(key);
    }
  }, {
    key: 'setObject',
    value: function setObject(object) {
      this.object = object;
    }
  }, {
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      //-- OVERRIDE
    }
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {
      //-- OVERRIDE
    }
  }, {
    key: 'setSystem',
    value: function setSystem(system) {
      this.system = system;
    }
  }, {
    key: 'getSystem',
    value: function getSystem() {
      return this.system;
    }
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {
      //-- OVERIDE?
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      this.object.sendMessage(message);
    }
  }, {
    key: 'addListener',
    value: function addListener(type, func, obj) {
      if (obj == null) obj = this.listeners;
      obj[type] = func;
    }
  }, {
    key: 'addResource',
    value: function addResource(type, id) {
      if (this.system == null) return;
      this.system.addResource(type, id);
    }
  }, {
    key: 'getResource',
    value: function getResource(type, id) {
      if (this.system == null) return;
      return this.system.getResource(type, id);
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {}
  }, {
    key: 'callListener',
    value: function callListener(type, listeners, params) {
      var f = listeners[type];
      if (f == null) return;
      f(params);
    }
  }, {
    key: 'receiveMessage',
    value: function receiveMessage(message) {
      this.callListener(message.type, this.listeners, message);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      //-- OVERRIDE
    }
  }, {
    key: 'connect',
    value: function connect(sender, signal, slot) {
      var c = this.object.getComponent(sender);
      if (!c) return;
      _SigSlt2.default.Connect(c, signal, this, slot);
    }
  }]);

  return EngineComponent;
}();

exports.default = EngineComponent;

},{"app/engine/message/SigSlt":86}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GridSystem = require('app/engine/system/GridSystem');

var _GridSystem2 = _interopRequireDefault(_GridSystem);

var _EngineComponent2 = require('app/engine/component/core/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridComponent = function (_EngineComponent) {
  _inherits(GridComponent, _EngineComponent);

  function GridComponent() {
    _classCallCheck(this, GridComponent);

    return _possibleConstructorReturn(this, (GridComponent.__proto__ || Object.getPrototypeOf(GridComponent)).call(this, _ComponentType2.default.GRID));
  }

  _createClass(GridComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      //if(!this.hasProperty("x")) this.setProperty("x", 0);
      //if(!this.hasProperty("y")) this.setProperty("y", 0);
      if (!this.hasProperty("flags")) this.setProperty("flags", 0);

      var x = this.getProperty("x");
      var y = this.getProperty("y");

      if (x != null && y != null) {
        this.setProperty("h", _EngineConstants2.default.GridToWorldH(x, y));
        this.setProperty("a", _EngineConstants2.default.GridToWorldA(x, y));
      }
    }
  }, {
    key: 'getFlag',
    value: function getFlag(flag) {
      return this.system.getFlagAt(this.getProperty("x"), this.getProperty("y"), flag);
    }
  }, {
    key: 'setFlag',
    value: function setFlag(flag) {
      return this.system.setFlagAt(this.getProperty("x"), this.getProperty("y"), flag);
    }
  }]);

  return GridComponent;
}(_EngineComponent3.default);

exports.default = GridComponent;

},{"app/engine/EngineConstants":68,"app/engine/component/core/EngineComponent":74,"app/engine/enum/ComponentType":81,"app/engine/system/GridSystem":90}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PhysicsSystem = require('app/engine/system/PhysicsSystem');

var _PhysicsSystem2 = _interopRequireDefault(_PhysicsSystem);

var _EngineComponent2 = require('app/engine/component/core/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhysicsComponent = function (_EngineComponent) {
  _inherits(PhysicsComponent, _EngineComponent);

  function PhysicsComponent() {
    _classCallCheck(this, PhysicsComponent);

    return _possibleConstructorReturn(this, (PhysicsComponent.__proto__ || Object.getPrototypeOf(PhysicsComponent)).call(this, _ComponentType2.default.PHYSICS));
  }

  _createClass(PhysicsComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {}
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render() {
      //-- OVERRIDE
    }
  }]);

  return PhysicsComponent;
}(_EngineComponent3.default);

exports.default = PhysicsComponent;

},{"app/engine/component/core/EngineComponent":74,"app/engine/enum/ComponentType":81,"app/engine/system/PhysicsSystem":93}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

var _DisplayComponent2 = require('app/engine/component/core/DisplayComponent');

var _DisplayComponent3 = _interopRequireDefault(_DisplayComponent2);

var _ComponentMessage = require('app/engine/component/core/ComponentMessage');

var _ComponentMessage2 = _interopRequireDefault(_ComponentMessage);

var _Engine = require('app/engine/Engine');

var _Engine2 = _interopRequireDefault(_Engine);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _CandyType = require('app/engine/enum/CandyType');

var _CandyType2 = _interopRequireDefault(_CandyType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CursorDisplayComponent = function (_DisplayComponent) {
  _inherits(CursorDisplayComponent, _DisplayComponent);

  // bow: null,

  // candyMap: null,

  function CursorDisplayComponent() {
    _classCallCheck(this, CursorDisplayComponent);

    return _possibleConstructorReturn(this, (CursorDisplayComponent.__proto__ || Object.getPrototypeOf(CursorDisplayComponent)).call(this));
  }

  _createClass(CursorDisplayComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      this.setProperty("dLocation", 0);
    }
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {}
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {
      this.bow = this.getResource(_ResourceType2.default.SPRITE, "object.bow");
      this.candyMap = {};
      this.candyMap[_CandyType2.default.A] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.01");
      this.candyMap[_CandyType2.default.B] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.02");
      this.candyMap[_CandyType2.default.C] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.03");
      this.candyMap[_CandyType2.default.D] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.04");
      this.candyMap[_CandyType2.default.E] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.05");
      this.candyMap[_CandyType2.default.F] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.06");
      this.candyMap[_CandyType2.default.G] = this.getResource(_ResourceType2.default.SPRITE, "object.candy.07");
    }
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'render',
    value: function render(dt, x, y) {
      var zoom = 10 - this.system.getZoomLevel();
      var viewport = this.system.getViewport();
      var scene = this.system.getScene();

      var a = this.getProperty("dLocation");

      var r = 400 * _EngineConstants2.default.R;

      var bw = this.bow.w * _EngineConstants2.default.R;
      var bh = this.bow.h * _EngineConstants2.default.R;
      var bx = x + viewport.w / 2 + r * Math.cos(a);
      var by = y + viewport.h / 2 - r * Math.sin(a);

      //scene.drawRect("", x - s/2, y - s/2, s, s);
      var _a = a * -1 - 3 * Math.PI / 4;

      scene.save();
      scene.translate(bx, by);
      scene.rotate(_a);
      // draw bow
      scene.drawImage(this.bow.img, this.bow.x, //sx,
      this.bow.y, //sy,
      this.bow.w, //sw,
      this.bow.h, //sh,
      bw / -2, //dx,
      bh / -2, //dy,
      bw, //dw,
      bh //dh
      );
      scene.restore();

      var candy = this.candyMap[this.getProperty('nextPiece')];
      var candys = _EngineConstants2.default.WorldToScreenS(CursorDisplayComponent.CANDY_H);
      var candyr = _EngineConstants2.default.WorldToScreenR(CursorDisplayComponent.CANDY_H);
      var candyx = x + viewport.w / 2 + candyr * Math.cos(a);
      var candyy = y + viewport.h / 2 - candyr * Math.sin(a);

      // draw
      scene.save();
      scene.translate(candyx, candyy);
      scene.rotate(_a);
      scene.drawImage(candy.img, candy.x, //sx,
      candy.y, //sy,
      candy.w, //sw,
      candy.h, //sh,
      candys / -2, //dx,
      candys / -2, //dy,
      candys, //dw,
      candys //dh
      );
      scene.restore();

      /*
      var ca = this.getProperty("cLocation");
      var cr = 400 * EngineConstants.R;
      var cx = x + (viewport.w/2) + (cr * Math.cos(ca));
      var cy = y + (viewport.h/2) - (cr * Math.sin(ca));
      scene.drawLine(cx, cy, (viewport.w/2), (viewport.h/2));
        var da = this.getProperty("dLocation");
      var ds = 20 * EngineConstants.R;
      var dr = 400 * EngineConstants.R;
      var dx = x + (viewport.w/2) + (dr * Math.cos(da)) - ds/2;
      var dy = y + (viewport.h/2) - (dr * Math.sin(da)) - ds/2;
      scene.drawRect("", dx, dy, ds, ds);
      */
    }
  }]);

  return CursorDisplayComponent;
}(_DisplayComponent3.default);

CursorDisplayComponent.CANDY_H = 13;

exports.default = CursorDisplayComponent;

},{"app/engine/Engine":67,"app/engine/EngineConstants":68,"app/engine/component/core/ComponentMessage":72,"app/engine/component/core/DisplayComponent":73,"app/engine/enum/CandyType":80,"app/resource/ResourceType":102,"minibot":"minibot"}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

var _EngineComponent2 = require('app/engine/component/core/EngineComponent');

var _EngineComponent3 = _interopRequireDefault(_EngineComponent2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _InputType = require('app/engine/enum/InputType');

var _InputType2 = _interopRequireDefault(_InputType);

var _GridFlag = require('app/engine/enum/GridFlag');

var _GridFlag2 = _interopRequireDefault(_GridFlag);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _SigSlt = require('app/engine/message/SigSlt');

var _SigSlt2 = _interopRequireDefault(_SigSlt);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CursorInputComponent = function (_EngineComponent) {
  _inherits(CursorInputComponent, _EngineComponent);

  // currentSection: null,

  function CursorInputComponent() {
    _classCallCheck(this, CursorInputComponent);

    var _this = _possibleConstructorReturn(this, (CursorInputComponent.__proto__ || Object.getPrototypeOf(CursorInputComponent)).call(this, _ComponentType2.default.INPUT));

    _SigSlt2.default.AddSignal(_this, _EngineComponent3.default.SIG_INPUT_MOVE);
    _SigSlt2.default.AddSignal(_this, _EngineComponent3.default.SIG_INPUT_ADD);
    //this.addSignal(EngineComponent.SIG_MOVE_CURSOR);
    //this.addSlot(CursorInputComponent.MOVE_CURSOR, function() {alert('moved')});
    return _this;
  }

  _createClass(CursorInputComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {
      // location properties
      //this.setProperty("dLocation", 0);
      //this.setProperty("cLocation", 0);
      //this.setProperty("iLocation", 0);
      //this.setProperty("section", 0);

      // flags
      //this.setProperty("moving", false);
      //this.setProperty("inserting", false);
      //this.setProperty("firing", false);
    }
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {}
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {
      this.system.addInputHandler(this, _InputType2.default.MOVE_CURSOR);
      this.system.addInputHandler(this, _InputType2.default.ADD_PIECE);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      // Not allowed on input types
    }
  }, {
    key: 'input',
    value: function input(type, data) {
      switch (type) {
        case _InputType2.default.ADD_PIECE:
          this.addPiece(data);
          break;
        case _InputType2.default.MOVE_CURSOR:
          this.moveCursor(data);
          break;
      }
    }
  }, {
    key: 'addPiece',
    value: function addPiece(a) {
      _SigSlt2.default.Emit(this, _EngineComponent3.default.SIG_INPUT_ADD, a);
      /*
      var inserting = this.getProperty("inserting");
      if(inserting) return;
      this.setProperty("inserting", true);
      this.setProperty("iLocation", a);
      */
    }
  }, {
    key: 'moveCursor',
    value: function moveCursor(a) {
      _SigSlt2.default.Emit(this, _EngineComponent3.default.SIG_INPUT_MOVE, a);
      /*
      var sec = Math.floor((a + EngineConstants.SECTION_ANGLE/2) / EngineConstants.SECTION_ANGLE) % (EngineConstants.SECTIONS*2);
      if(sec != this.currentSection) {
        this.system.dispatchEvent(new EngineEvent(EngineEvent.DEL_SEC_FLAGS, null, null, {"sec": this.currentSection, "flag": GridFlag.SELECTED}));
        this.system.dispatchEvent(new EngineEvent(EngineEvent.SET_SEC_FLAGS, null, null, {"sec": sec, "flag": GridFlag.SELECTED}));
        this.currentSection = sec;
        this.setProperty('section', this.currentSection);
      }
      */
    }
  }]);

  return CursorInputComponent;
}(_EngineComponent3.default);

exports.default = CursorInputComponent;

},{"app/engine/EngineConstants":68,"app/engine/component/core/EngineComponent":74,"app/engine/enum/ComponentType":81,"app/engine/enum/GridFlag":83,"app/engine/enum/InputType":84,"app/engine/message/SigSlt":86,"app/event/EngineEvent":95,"minibot":"minibot"}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _GameObjectType = require('app/engine/enum/GameObjectType');

var _GameObjectType2 = _interopRequireDefault(_GameObjectType);

var _EngineComponent = require('app/engine/component/core/EngineComponent');

var _EngineComponent2 = _interopRequireDefault(_EngineComponent);

var _PhysicsComponent2 = require('app/engine/component/core/PhysicsComponent');

var _PhysicsComponent3 = _interopRequireDefault(_PhysicsComponent2);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _SigSlt = require('app/engine/message/SigSlt');

var _SigSlt2 = _interopRequireDefault(_SigSlt);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BindAsEventListener = _minibot2.default.core.Utils.BindAsEventListener;

var CursorPhysicsComponent = function (_PhysicsComponent) {
  _inherits(CursorPhysicsComponent, _PhysicsComponent);

  // firingTime: null,

  // dispenserLocation: null,
  // cursorLocation: null,
  // insertLocation: null,
  // section: null,

  // currentSection: null,
  // dispenserSection: null,

  // moving: null,
  // inserting: null,
  // firing: null,
  // shooting: null,

  function CursorPhysicsComponent() {
    _classCallCheck(this, CursorPhysicsComponent);

    var _this = _possibleConstructorReturn(this, (CursorPhysicsComponent.__proto__ || Object.getPrototypeOf(CursorPhysicsComponent)).call(this));

    _this.dispenserLocation = 0;
    _this.cursorLocation = 0;
    _this.insertLocation = 0;
    _this.section = 0;

    _this.currentSection = 0;
    _this.dispenserSection = 0;
    _this.insertSection = 0;

    _this.moving = false;
    _this.inserting = false;
    _this.firing = false;
    _this.shooting = false;

    _SigSlt2.default.AddSlot(_this, _EngineComponent2.default.SLT_CURSOR_MOVE, _this.cursorMove);
    _SigSlt2.default.AddSlot(_this, _EngineComponent2.default.SLT_CURSOR_ADD, _this.cursorAdd);

    _SigSlt2.default.AddSlot(_this, _EngineComponent2.default.SLT_CANDY_SHOT_END, _this.candyShotEnd);
    return _this;
  }

  _createClass(CursorPhysicsComponent, [{
    key: 'onAddedToObject',
    value: function onAddedToObject() {}
  }, {
    key: 'onAddedToSystem',
    value: function onAddedToSystem() {
      this.setProperty('nextPiece', this.system.engine.randomCandy());

      this.system.engine.addEventListener(_EngineEvent2.default.FORCE_DROP, BindAsEventListener(this.handleForceDrop, this));
    }
  }, {
    key: 'onComponentsAdded',
    value: function onComponentsAdded() {
      this.connect(_ComponentType2.default.INPUT, _EngineComponent2.default.SIG_INPUT_MOVE, _EngineComponent2.default.SLT_CURSOR_MOVE);
      this.connect(_ComponentType2.default.INPUT, _EngineComponent2.default.SIG_INPUT_ADD, _EngineComponent2.default.SLT_CURSOR_ADD);
    }
  }, {
    key: 'onResourcesLoaded',
    value: function onResourcesLoaded() {}
  }, {
    key: 'update',
    value: function update(dt) {
      this.moveDispenser(dt);
    }
  }, {
    key: 'cursorMove',
    value: function cursorMove(a) {
      var sec = Math.floor((a + _EngineConstants2.default.SECTION_ANGLE / 2) / _EngineConstants2.default.SECTION_ANGLE) % (_EngineConstants2.default.SECTIONS * 2);
      if (sec != this.currentSection) {
        this.moving = true;
        this.currentSection = sec;
      }
    }
  }, {
    key: 'cursorAdd',
    value: function cursorAdd(a) {
      if (this.inserting || this.shooting) return;
      this.inserting = true;
      this.insertSection = Math.floor((a + _EngineConstants2.default.SECTION_ANGLE / 2) / _EngineConstants2.default.SECTION_ANGLE) % (_EngineConstants2.default.SECTIONS * 2);
    }
  }, {
    key: 'handleForceDrop',
    value: function handleForceDrop() {
      if (this.inserting || this.shooting) return;
      this.inserting = true;
      this.insertSection = this.currentSection;
    }
  }, {
    key: 'moveDispenser',
    value: function moveDispenser(dt) {
      //if(this.shooting) return;
      // Move dispenser to insert location
      var MOVE_ANGLE = Math.PI / 180;
      var MIN_ANGLE = Math.PI / 4;
      var dest = null;

      if (this.moving) {
        if (this.inserting) {
          dest = this.insertSection * _EngineConstants2.default.SECTION_ANGLE;
        } else {
          dest = this.currentSection * _EngineConstants2.default.SECTION_ANGLE;
        }
        var d1 = dest - this.dispenserLocation;
        var d2;
        var dF = this.dispenserLocation;
        if (d1 < 0) {
          d2 = 2 * Math.PI + d1;
        } else {
          d2 = -1 * (2 * Math.PI - d1);
        }
        if (Math.abs(d1) <= Math.abs(d2)) {
          dF = d1;
        } else {
          dF = d2;
        }

        if (Math.abs(dF) < MOVE_ANGLE) {
          this.dispenserLocation = dest;
          this.moving = false;
          if (this.inserting) {
            this.firing = true;
          }
        } else {
          this.dispenserLocation = (this.dispenserLocation + dF * dt / 150) % (2 * Math.PI);
          if (this.dispenserLocation < 0) this.dispenserLocation += 2 * Math.PI;
        }
        this.setProperty("dLocation", this.dispenserLocation);
      } else if (this.inserting) {
        this.firing = true;
      }

      if (this.firing) {

        this.firing = false;
        this.inserting = false;
        this.shooting = true;

        var type = this.getProperty('nextPiece');
        this.setProperty('nextPiece', this.system.engine.randomCandy());

        var h = 13 - (10 - this.system.engine.getSystem(_ComponentType2.default.DISPLAY).getZoomLevel());
        var a = this.insertSection * _EngineConstants2.default.SECTION_ANGLE;

        var candy = this.system.engine.createObject(_GameObjectType2.default.CANDY, {
          "candyType": type,
          "fromCursor": true,
          "h": h,
          "a": a,
          "sec": this.insertSection
        });

        _SigSlt2.default.Connect(candy.getComponent(_ComponentType2.default.PHYSICS), _EngineComponent2.default.SIG_CANDY_SHOT_END, this, _EngineComponent2.default.SLT_CANDY_SHOT_END);
        this.system.engine.addObject(candy);
      }
    }
  }, {
    key: 'candyShotEnd',
    value: function candyShotEnd(candy) {
      this.shooting = false;
      this.moving = true;
    }
  }]);

  return CursorPhysicsComponent;
}(_PhysicsComponent3.default);

exports.default = CursorPhysicsComponent;

},{"app/engine/EngineConstants":68,"app/engine/component/core/EngineComponent":74,"app/engine/component/core/PhysicsComponent":76,"app/engine/enum/ComponentType":81,"app/engine/enum/GameObjectType":82,"app/engine/message/SigSlt":86,"app/event/EngineEvent":95,"minibot":"minibot"}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CandyType = {};

CandyType.A = 1;
CandyType.B = 2;
CandyType.C = 3;
CandyType.D = 4;
CandyType.E = 5;
CandyType.F = 6;
CandyType.G = 7;

exports.default = CandyType;

},{}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ComponentType = {};

ComponentType.PHYSICS = 2;
ComponentType.DISPLAY = 3;
ComponentType.INPUT = 4;
ComponentType.GRID = 5;
ComponentType.LOGIC = 6;
ComponentType.SOUND = 7;
ComponentType.STATISTICS = 8;

exports.default = ComponentType;

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObjectType = {};

GameObjectType.CANDY = 1;
GameObjectType.POWERUP = 2;
GameObjectType.CAMERA = 3;
GameObjectType.CURSOR = 4;

exports.default = GameObjectType;

},{}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GridFlag = {};

GridFlag.SELECTED = 1;

exports.default = GridFlag;

},{}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InputType = {};

InputType.MOVE_CURSOR = 1;
InputType.ADD_PIECE = 2;

exports.default = InputType;

},{}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GameObjectType = require('app/engine/enum/GameObjectType');

var _GameObjectType2 = _interopRequireDefault(_GameObjectType);

var _EngineObject = require('app/engine/object/EngineObject');

var _EngineObject2 = _interopRequireDefault(_EngineObject);

var _CandyGridComponent = require('app/engine/component/candy/CandyGridComponent');

var _CandyGridComponent2 = _interopRequireDefault(_CandyGridComponent);

var _CandyDisplayComponent = require('app/engine/component/candy/CandyDisplayComponent');

var _CandyDisplayComponent2 = _interopRequireDefault(_CandyDisplayComponent);

var _CandyPhysicsComponent = require('app/engine/component/candy/CandyPhysicsComponent');

var _CandyPhysicsComponent2 = _interopRequireDefault(_CandyPhysicsComponent);

var _CursorPhysicsComponent = require('app/engine/component/cursor/CursorPhysicsComponent');

var _CursorPhysicsComponent2 = _interopRequireDefault(_CursorPhysicsComponent);

var _CursorInputComponent = require('app/engine/component/cursor/CursorInputComponent');

var _CursorInputComponent2 = _interopRequireDefault(_CursorInputComponent);

var _CursorDisplayComponent = require('app/engine/component/cursor/CursorDisplayComponent');

var _CursorDisplayComponent2 = _interopRequireDefault(_CursorDisplayComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectFactory = {};

ObjectFactory.Create = function (type, data) {

  var object = new _EngineObject2.default(type, data);
  switch (type) {
    case _GameObjectType2.default.CANDY:
      object.addComponent(new _CandyGridComponent2.default());
      object.addComponent(new _CandyDisplayComponent2.default());
      object.addComponent(new _CandyPhysicsComponent2.default());
      break;
    case _GameObjectType2.default.CURSOR:
      object.addComponent(new _CursorPhysicsComponent2.default());
      object.addComponent(new _CursorInputComponent2.default());
      object.addComponent(new _CursorDisplayComponent2.default());
      break;
  }

  object.onComponentsAdded();

  return object;
};

exports.default = ObjectFactory;

},{"app/engine/component/candy/CandyDisplayComponent":69,"app/engine/component/candy/CandyGridComponent":70,"app/engine/component/candy/CandyPhysicsComponent":71,"app/engine/component/cursor/CursorDisplayComponent":77,"app/engine/component/cursor/CursorInputComponent":78,"app/engine/component/cursor/CursorPhysicsComponent":79,"app/engine/enum/GameObjectType":82,"app/engine/object/EngineObject":87}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var SigSlt = {};
/* From: http://codeforthecloset.blogspot.in/2008/12/signals-and-slots-for-javascript.html */

/* Signal : Factory Function
* Returns a function that has methods
* for connecting and disconnecting functions
* from it.
* When the function is invoked, the invocation
* is dispatched to each of the registered
* functions
* stateful - if the calling scope should be
*    passed on to
*    underlying dispatches. */
SigSlt.Signal = function (stateful) {
    var slots = [];
    /* _signal : Proxy Function
     * acts as a multicast proxy to the
     * functions connected to it,
     * passing along the arguments it was
     * invoked with */
    var _signal = function _signal() {
        //var arglist = [];
        if (stateful) arglist.push(this);
        //convertArguments(arguments,0,arglist);
        for (var j = 0; j < slots.length; j++) {
            var obj = slots[j][0];
            if (obj == undefined) obj = this;
            var fun = slots[j][1];
            try {
                fun.apply(obj, arguments);
            } catch (e) {}
        }
    };
    /* _signal.connect: Function
    * Connects a function and the scope to be
    * called when the signal is invoked.
    * fun - The function to be invoked on
    *    signal.
    * obj - The scope
    */
    _signal.connect = function (fun, scope) {
        slots.push([scope, fun]);
    };
    /*  _signal.disconnect: Function
    * Disconnects a matching function from a
    * signal.
    * fun - The function to be removed.
    * obj - The scope
    */
    _signal.disconnect = function (fun, scope) {
        var shift = false;
        for (var i = 0; i < slots.length; i++) {
            if (shift) slots[i - 1] = slots[i];else if (scope == slots[i][0] && fun == slots[i][1]) shift = true;
        }
        if (shift) slots.pop();
    };
    _signal.disconnect_all = function () {
        var slen = slots.length;
        for (var i = 0; i < slen; i++) {
            slots.pop();
        }
    };
    return _signal;
};

/* Connect : Helper function
* connects a sender to a reciever
* through a signal and slot
* sender - the object which will send
*      the signal.
* signal - string name representing
*      the signal
* rec - object to recieve the
*      signal notification.
* slot - a string that will be used
*      to look up the same named attr
*      on rec, which should be a
*      function.  The function gets
*      the arguments passed to the
*      signal.  If stateful, the
*      first argument will be the
*      scope of the connect call.*/
SigSlt.Connect = function (sender, signal, rec, slot) {
    var sigf;
    var err = null;
    if (sender.signals[signal] == undefined) {
        sigf = Signal(true);
        sender.signals[signal] = sigf;
    } else {
        if (!sender.signals[signal].connect) {
            err = "No Signal " + signal;
            throw new Error(err);
        } else {
            sigf = sender.signals[signal];
        }
    }
    var slot_type = typeof slot === "undefined" ? "undefined" : _typeof(slot);
    var rec_type = typeof rec === "undefined" ? "undefined" : _typeof(rec);
    if (rec) {
        var slotf = rec.slots[slot];
        if (typeof slotf == "function") {
            sigf.connect(slotf, rec);
            return;
        }
    }
    err = "Bad Slot";
    throw new Error(err);
};

SigSlt.AddSignal = function (obj, name) {
    if (!obj['signals']) obj['signals'] = {};
    obj['signals'][name] = SigSlt.Signal(false);
};

SigSlt.AddSlot = function (obj, name, fx) {
    if (!obj['slots']) obj['slots'] = {};
    obj['slots'][name] = fx;
};

SigSlt.Emit = function (obj, name) {
    var args = [].slice.call(arguments, 2);
    if (!obj['signals'] || !obj['signals'][name]) return;
    obj['signals'][name].apply(obj, args);
};

exports.default = SigSlt;

},{}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EngineObject = function () {

  // type: null,
  // components: null,
  // data: null,
  // engine: null,

  function EngineObject(type, data) {
    _classCallCheck(this, EngineObject);

    this.type = type;
    this.components = {};

    if (data == undefined) data = {};
    this.data = data;
  }

  _createClass(EngineObject, [{
    key: "destroy",
    value: function destroy() {
      this.components = null;
      this.engine = null;
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "addComponent",
    value: function addComponent(component) {
      var type = component.getType();
      if (this.components[type] == undefined) {
        this.components[type] = component;
        component.setObject(this);
        component.onAddedToObject();
      }
    }
  }, {
    key: "onComponentsAdded",
    value: function onComponentsAdded() {
      for (var c in this.components) {
        this.components[c].onComponentsAdded();
      }
    }
  }, {
    key: "removeComponent",
    value: function removeComponent(component) {}
  }, {
    key: "setEngine",
    value: function setEngine(engine) {
      this.engine = engine;
    }
  }, {
    key: "onAddedToEngine",
    value: function onAddedToEngine() {
      //-- OVERRIDE
    }
  }, {
    key: "onResourcesLoaded",
    value: function onResourcesLoaded() {
      for (var c in this.components) {
        this.components[c].onResourcesLoaded();
      }
    }
  }, {
    key: "getComponent",
    value: function getComponent(type) {
      if (this.components[type] != undefined) {
        return this.components[type];
      }
      return null;
    }
  }, {
    key: "hasComponent",
    value: function hasComponent(type) {
      return this.components[type] != undefined;
    }
  }, {
    key: "update",
    value: function update(dt) {
      for (var c in this.components) {
        this.components[c].update(dt);
      }
    }
  }, {
    key: "setProperty",
    value: function setProperty(key, value) {
      this.data[key] = value;
    }
  }, {
    key: "getProperty",
    value: function getProperty(key) {
      return this.data[key];
    }
  }, {
    key: "hasProperty",
    value: function hasProperty(key) {
      return this.data[key] != undefined;
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(message) {
      for (var c in this.components) {
        this.components[c].receiveMessage(message);
      }
    }
  }]);

  return EngineObject;
}();

exports.default = EngineObject;

},{}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _EngineSystem2 = require('app/engine/system/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BindAsEventListener = _minibot2.default.core.Utils.BindAsEventListener;

var DisplaySystem = function (_EngineSystem) {
  _inherits(DisplaySystem, _EngineSystem);

  // layers: null,


  // maxDepth: null,

  // isZooming: null,
  // zoomLevel: null,
  // zoomLevelDest: null,

  function DisplaySystem() {
    _classCallCheck(this, DisplaySystem);

    var _this = _possibleConstructorReturn(this, (DisplaySystem.__proto__ || Object.getPrototypeOf(DisplaySystem)).call(this, _ComponentType2.default.DISPLAY));

    _this.layers = [];
    _this.isInserting = false;
    _this.isZooming = false;
    _this.zoomLevel = 2;
    return _this;
  }

  _createClass(DisplaySystem, [{
    key: 'setup',
    value: function setup() {
      this.findMaxDepth();
      this.zoomLevel = this.maxDepth;
      this.zoomLevel = 2;
    }
  }, {
    key: 'addObject',
    value: function addObject(obj) {
      var c = _get(DisplaySystem.prototype.__proto__ || Object.getPrototypeOf(DisplaySystem.prototype), 'addObject', this).call(this, obj);
      if (c == null) return null;

      var l = c.getLayers();
      for (var i = 0; i < l.length; i++) {
        this.addToLayer(c, l[i]);
      }
    }
  }, {
    key: 'removeObject',
    value: function removeObject(obj) {
      var c = _get(DisplaySystem.prototype.__proto__ || Object.getPrototypeOf(DisplaySystem.prototype), 'removeObject', this).call(this, obj);
      if (c == null) return null;

      var l = c.getLayers();
      for (var i = 0; i < l.length; i++) {
        this.removeFromLayer(c, l[i]);
      }
    }
  }, {
    key: 'addToLayer',
    value: function addToLayer(component, layer) {
      while (!this.layers[layer]) {
        this.layers.push([]);
      }
      this.layers[layer].push(component);
    }
  }, {
    key: 'removeFromLayer',
    value: function removeFromLayer(component, layer) {
      var arr = this.layers[layer];
      var i = arr.indexOf(component);
      if (i != -1) arr.splice(i, 1);
    }
  }, {
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {
      this.engine.addEventListener(_EngineEvent2.default.DEPTH_CHANGED, BindAsEventListener(this.handleDepthChanged, this));

      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.01');
      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.02');
      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.03');
      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.04');
      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.05');
      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.06');
      this.addResource(_ResourceType2.default.SPRITE, 'object.candy.07');

      this.addResource(_ResourceType2.default.SPRITE, 'object.bow');
    }

    // update all of the components

  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'getZoomLevel',
    value: function getZoomLevel() {
      if (this.zoomLevel < 2) return 2;
      return this.zoomLevel;
    }
  }, {
    key: 'getViewport',
    value: function getViewport() {
      return this.engine.viewport;
    }
  }, {
    key: 'getScene',
    value: function getScene() {
      return this.engine.scene;
    }

    // render the scene layer by layer, check if each component is on screen first

  }, {
    key: 'render',
    value: function render(dt, x, y) {

      if (this.isZooming) {
        this.zoomLevel += (this.zoomLevelDest - this.zoomLevel) * 0.1;
        if (Math.abs(this.zoomLevelDest - this.zoomLevel) <= 0.01) {
          this.isZooming = false;
          this.zoomLevel = this.zoomLevelDest;
        }
      }

      var i, j, layer, component;
      for (i = 0; i < this.layers.length; i++) {
        layer = this.layers[i];
        for (j = 0; j < layer.length; j++) {
          component = layer[j];
          if (!component.isVisible()) continue;
          component.render(dt, x, y);
        }
      }
    }
  }, {
    key: 'handleDepthChanged',
    value: function handleDepthChanged(event) {
      if (!this.isZooming) {
        this.isZooming = true;
        this.zoomLevelDest = event.data;
      }
    }
  }]);

  return DisplaySystem;
}(_EngineSystem3.default);

exports.default = DisplaySystem;

},{"app/engine/enum/ComponentType":81,"app/engine/system/EngineSystem":89,"app/event/EngineEvent":95,"app/resource/ResourceType":102,"minibot":"minibot"}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EngineSystem = function () {

  // type: null,

  // components: null,

  // componentsByObject: null,

  // engine: null,

  // initialized: null,

  function EngineSystem(type) {
    _classCallCheck(this, EngineSystem);

    this.type = type;

    this.components = [];

    this.componentsByObject = {};

    this.initialized = false;
  }

  _createClass(EngineSystem, [{
    key: "destroy",
    value: function destroy() {
      for (var i = 0; i < this.components.length; i++) {
        this.components[i].destroy();
      }
      this.components = null;
      this.componentsByObject = null;
      this.engine = null;
    }
  }, {
    key: "onInitialized",
    value: function onInitialized() {
      this.initialized = true;
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "addObject",
    value: function addObject(obj) {
      if (obj.hasComponent(this.type)) {
        var c = obj.getComponent(this.type);
        this.components.push(c);
        this.componentsByObject[obj] = c;

        c.setSystem(this);
        c.onAddedToSystem();

        return c;
      }

      return null;
    }
  }, {
    key: "addResource",
    value: function addResource(type, id) {
      if (!this.engine) return;
      this.engine.addResource(type, id);
    }
  }, {
    key: "getResource",
    value: function getResource(type, id) {
      if (!this.engine) return;
      return this.engine.getResource(type, id);
    }
  }, {
    key: "removeObject",
    value: function removeObject(obj) {
      if (obj.hasComponent(this.type)) {
        var c = obj.getComponent(this.type);

        var i = this.components.indexOf(c);
        if (i != -1) this.components.splice(i, 1);

        if (this.componentsByObject[obj] != undefined) {
          delete this.componentsByObject[obj];
        }

        return c;
      }

      return null;
    }
  }, {
    key: "setEngine",
    value: function setEngine(engine) {
      this.engine = engine;
    }
  }, {
    key: "onAddedToEngine",
    value: function onAddedToEngine() {
      //-- OVERRIDE
    }
  }, {
    key: "onResourcesLoaded",
    value: function onResourcesLoaded() {}
  }, {
    key: "update",
    value: function update(dt) {}
    //-- OVERRIDE


    // Helper function to update all components of the system

  }, {
    key: "updateComponents",
    value: function updateComponents(dt) {
      for (var i = 0; i < this.components.length; i++) {
        this.components[i].update(dt);
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      this.engine.dispatchEvent(event);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      this.engine.addEventListener(type, callback);
    }
  }]);

  return EngineSystem;
}();

exports.default = EngineSystem;

},{}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _EngineSystem2 = require('app/engine/system/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _EngineConstants = require('app/engine/EngineConstants');

var _EngineConstants2 = _interopRequireDefault(_EngineConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BindAsEventListener = _minibot2.default.core.Utils.BindAsEventListener;

var GridSystem = function (_EngineSystem) {
  _inherits(GridSystem, _EngineSystem);

  // width: null,
  // height: null,
  // length: null,

  // objects: null,
  // flags: null,

  // maxDepth: null,

  function GridSystem(width, height) {
    _classCallCheck(this, GridSystem);

    var _this = _possibleConstructorReturn(this, (GridSystem.__proto__ || Object.getPrototypeOf(GridSystem)).call(this, _ComponentType2.default.GRID));

    _this.width = width;
    _this.height = height;
    _this.length = width * height;

    _this.objects = [];
    _this.flags = [];

    for (var i = 0; i < _this.length; i++) {
      _this.objects[i] = null;
      _this.flags[i] = 0;
    }

    return _this;
  }

  _createClass(GridSystem, [{
    key: 'onInitialized',
    value: function onInitialized() {
      _get(GridSystem.prototype.__proto__ || Object.getPrototypeOf(GridSystem.prototype), 'onInitialized', this).call(this);
      this.findMaxDepth();
    }
  }, {
    key: 'addObject',
    value: function addObject(obj) {
      var c = _get(GridSystem.prototype.__proto__ || Object.getPrototypeOf(GridSystem.prototype), 'addObject', this).call(this, obj);

      if (c != null) {
        var x = c.getProperty("x");
        var y = c.getProperty("y");
        if (x != null && y != null) {
          this.setAt(x, y, c);
        }
      }

      return c;
    }
  }, {
    key: 'removeObject',
    value: function removeObject(obj) {
      var c = _get(GridSystem.prototype.__proto__ || Object.getPrototypeOf(GridSystem.prototype), 'removeObject', this).call(this, obj);

      if (c != null) {
        var x = c.getProperty("x");
        var y = c.getProperty("y");
        if (x != null && y != null) {
          this.deleteAt(x, y);
        }
      }

      return c;
    }
  }, {
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {
      this.engine.addEventListener(_EngineEvent2.default.DEL_SEC_FLAGS, BindAsEventListener(this.handleDelSecFlags, this));
      this.engine.addEventListener(_EngineEvent2.default.SET_SEC_FLAGS, BindAsEventListener(this.handleSetSecFlags, this));
      this.engine.addEventListener(_EngineEvent2.default.DEL_ROW_FLAGS, BindAsEventListener(this.handleDelRowFlags, this));
      this.engine.addEventListener(_EngineEvent2.default.SET_ROW_FLAGS, BindAsEventListener(this.handleSetRowFlags, this));
    }
  }, {
    key: 'update',
    value: function update(dt) {}
  }, {
    key: 'inGrid',
    value: function inGrid(x, y) {
      if (x < 0 || x >= this.width) return false;
      if (y < 0 || y >= this.height) return false;
      return true;
    }
  }, {
    key: 'hasAt',
    value: function hasAt(x, y) {
      return this.getAt(x, y) != null;
    }
  }, {
    key: 'getAt',
    value: function getAt(x, y) {
      if (!this.inGrid(x, y)) return null;
      return this.objects[x + y * this.width];
    }
  }, {
    key: 'setAt',
    value: function setAt(x, y, value) {

      // Detect End Game!
      if (y >= this.height) {
        this.engine.stop();
        var event = new _EngineEvent2.default(_EngineEvent2.default.GAME_FAIL, null, null, null);
        this.dispatchEvent(event);
      }

      if (!this.inGrid(x, y)) return;
      this.objects[x + y * this.width] = value;
      this.deleteFlagsAt(x, y);
    }
  }, {
    key: 'deleteAt',
    value: function deleteAt(x, y) {
      this.setAt(x, y, null);
      this.deleteFlagsAt(x, y);
    }
  }, {
    key: 'getFlagAt',
    value: function getFlagAt(x, y, bit) {
      if (!this.inGrid(x, y)) return null;
      return (this.flags[x + y * this.width] >> bit) % 2 != 0;
    }
  }, {
    key: 'setFlagAt',
    value: function setFlagAt(x, y, bit) {
      if (!this.inGrid(x, y)) return;
      var i = x + y * this.width;
      this.flags[i] = this.flags[i] | 1 << bit;
      if (this.objects[i] != null) this.objects[i].setProperty('flags', this.flags[i]);
    }
  }, {
    key: 'deleteFlagAt',
    value: function deleteFlagAt(x, y, bit) {
      if (!this.inGrid(x, y)) return;
      var i = x + y * this.width;
      this.flags[i] = this.flags[i] & ~(1 << bit);
      if (this.objects[i] != null) this.objects[i].setProperty('flags', this.flags[i]);
    }
  }, {
    key: 'deleteFlagsAt',
    value: function deleteFlagsAt(x, y) {
      if (!this.inGrid(x, y)) return;
      var i = x + y * this.width;
      this.flags[i] = 0;
      if (this.objects[i] != null) this.objects[i].setProperty('flags', this.flags[i]);
    }
  }, {
    key: 'getMatches',
    value: function getMatches(x, y, compare) {
      var matches = [];
      if (!this.hasAt(x, y)) return matches;
      var objA = this.getAt(x, y);

      var checked = [];
      for (var i = 0; i < this.length; i++) {
        checked[i] = false;
      }
      this.getMatchesAt(x, y, matches, checked, function (objB) {
        return compare(objA, objB);
      }.bind(this));
      return matches;
    }
  }, {
    key: 'getMatchesAt',
    value: function getMatchesAt(x, y, matches, checked, compare) {
      if (x < 0) x += this.width;
      if (x >= this.width) x -= this.width;
      if (y < 0) y += this.height;
      if (y >= this.height) y -= this.height;

      if (checked[x + y * this.width]) return;
      checked[x + y * this.width] = true;
      if (!this.hasAt(x, y)) return;
      var obj = this.getAt(x, y);
      if (!compare(obj)) return;

      //if(getFlagAt(x, y, MATCHING_FLAG)) return;

      matches.push(obj);

      this.getMatchesAt(x + 1, y - 1, matches, checked, compare);
      this.getMatchesAt(x - 1, y + 1, matches, checked, compare);
      this.getMatchesAt(x, y + 1, matches, checked, compare);
      this.getMatchesAt(x, y - 1, matches, checked, compare);
      this.getMatchesAt(x - 1, y + 2, matches, checked, compare);
      this.getMatchesAt(x + 1, y - 2, matches, checked, compare);
    }
  }, {
    key: 'fallPiecesAt',
    value: function fallPiecesAt(ix, iy) {
      var sec = _EngineConstants2.default.GridToWorldSec(ix, iy);
      this.iterateBySection(sec, function (x, y) {
        if (y > iy) {
          if (this.hasAt(x, y)) {
            var c = this.getAt(x, y);
            c.drop();
          }
        }
      }.bind(this));
    }
  }, {
    key: 'findMaxDepth',
    value: function findMaxDepth() {
      var depth = 0;
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          if (this.hasAt(x, y)) {
            depth = y;
            break;
          }
        }
      }

      // We need to update the zoom!
      if (this.maxDepth != depth) {
        this.maxDepth = depth;

        var event = new _EngineEvent2.default(_EngineEvent2.default.DEPTH_CHANGED, null, null, depth);
        this.dispatchEvent(event);
      }
    }
  }, {
    key: 'iterateBySection',
    value: function iterateBySection(section, each) {
      var y = 0;
      var x = Math.floor(section / 2);
      if (section % 2) y = 1;
      try {
        while (y < _EngineConstants2.default.DEPTH) {
          each(x, y);
          y += 2;
          x -= 1;
          if (x < 0) x += _EngineConstants2.default.SECTIONS;
        }
      } catch (e) {
        if (e != GridSystem.$break) throw e;
      }
    }
  }, {
    key: 'iterateByRing',
    value: function iterateByRing(ring, each) {
      var y = ring;
      var x = 0;
      try {
        while (x < _EngineConstants2.default.SECTIONS) {
          each(x, y);
          x += 1;
        }
      } catch (e) {
        if (e != GridSystem.$break) throw e;
      }
    }
  }, {
    key: 'setFlagsOnSection',
    value: function setFlagsOnSection(section, flag) {
      this.iterateBySection(section, function (x, y) {
        this.setFlagAt(x, y, flag);
      }.bind(this));
    }
  }, {
    key: 'deleteFlagsOnSection',
    value: function deleteFlagsOnSection(section, flag) {
      this.iterateBySection(section, function (x, y) {
        this.deleteFlagAt(x, y, flag);
      }.bind(this));
    }

    /**
     *
     */

  }, {
    key: 'handleSetSecFlags',
    value: function handleSetSecFlags(event) {
      this.setFlagsOnSection(event.data.sec, event.data.flag);
    }
  }, {
    key: 'handleDelSecFlags',
    value: function handleDelSecFlags(event) {
      this.deleteFlagsOnSection(event.data.sec, event.data.flag);
    }
  }, {
    key: 'handleSetRowFlags',
    value: function handleSetRowFlags(event) {}
  }, {
    key: 'handleDelRowFlags',
    value: function handleDelRowFlags(event) {}
  }]);

  return GridSystem;
}(_EngineSystem3.default);

exports.default = GridSystem;

},{"app/engine/EngineConstants":68,"app/engine/enum/ComponentType":81,"app/engine/system/EngineSystem":89,"app/event/EngineEvent":95,"minibot":"minibot"}],91:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _EngineSystem2 = require('app/engine/system/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _InputType = require('app/engine/enum/InputType');

var _InputType2 = _interopRequireDefault(_InputType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BindAsEventListener = _minibot2.default.core.Utils.BindAsEventListener;

var InputSystem = function (_EngineSystem) {
  _inherits(InputSystem, _EngineSystem);

  // inputQueue: null,

  // inputHandlers: null,

  function InputSystem() {
    _classCallCheck(this, InputSystem);

    var _this = _possibleConstructorReturn(this, (InputSystem.__proto__ || Object.getPrototypeOf(InputSystem)).call(this, _ComponentType2.default.INPUT));

    _this.inputQueue = [];
    _this.inputHandlers = {};
    return _this;
  }

  _createClass(InputSystem, [{
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {
      this.addEventListener(_EngineEvent2.default.INPUT, BindAsEventListener(this.handleInput, this));
    }
  }, {
    key: 'update',
    value: function update(dt) {
      while (this.inputQueue.length) {
        var q = this.inputQueue.shift();
        while (this.inputQueue.length && this.inputQueue[0].type == q.type) {
          q = this.inputQueue.shift();
        }
        var c = this.inputHandlers[q.type];
        if (c != null) {
          c.input(q.type, q.data);
        }
      }
    }
  }, {
    key: 'handleInput',
    value: function handleInput(event) {
      this.inputQueue.push(event.data);
    }
  }, {
    key: 'addInputHandler',
    value: function addInputHandler(component, type) {
      if (this.inputHandlers[type] != null) {
        // THROW AN ERROR HERE or change to array type...
        alert('hey fix this so it can use multiple handlers');
      } else {
        this.inputHandlers[type] = component;
      }
    }
  }, {
    key: 'removeInputHandler',
    value: function removeInputHandler(component, type) {}
  }]);

  return InputSystem;
}(_EngineSystem3.default);

exports.default = InputSystem;

},{"app/engine/enum/ComponentType":81,"app/engine/enum/InputType":84,"app/engine/system/EngineSystem":89,"app/event/EngineEvent":95,"minibot":"minibot"}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineSystem2 = require('app/engine/system/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

var _GameObjectType = require('app/engine/enum/GameObjectType');

var _GameObjectType2 = _interopRequireDefault(_GameObjectType);

var _ObjectFactory = require('app/engine/factory/ObjectFactory');

var _ObjectFactory2 = _interopRequireDefault(_ObjectFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogicSystem = function (_EngineSystem) {
  _inherits(LogicSystem, _EngineSystem);

  // 1 to length
  // dropTimerPosition: null,
  // dropTimerLength: null,
  // dropTimerLast: null,
  // dropTimerCallback: null,

  // 1 to length
  // comboMeterPosition: null,
  // comboMeterLength: null,
  // comboMeterLast: null,
  // comboCount: null,
  // comboMeterCallback: null,

  // The counter that counts consecutive non matches
  // voidCount: null,
  // voidLength: null,
  // voidCallback: null,

  //
  // penalizing: null,
  // penaltyPosition: null,
  // penaltyLast: null,
  // penaltyLocations: null,

  // matchesLeft: null,
  // matchesCallback: null,

  // isRunning: null,

  // tickSpeed: null,

  function LogicSystem(options) {
    _classCallCheck(this, LogicSystem);

    var _this = _possibleConstructorReturn(this, (LogicSystem.__proto__ || Object.getPrototypeOf(LogicSystem)).call(this, _ComponentType2.default.LOGIC));

    _this.dropTimerLength = LogicSystem.PENALTY_TIMER_TICKS;
    _this.dropTimerPosition = LogicSystem.PENALTY_TIMER_TICKS;
    _this.dropTimerLast = 0;

    _this.comboMeterPosition = 0;
    _this.comboMeterLength = LogicSystem.COMBO_METER_TICKS;
    _this.comboMeterLast = 0;
    _this.comboCount = 0;

    _this.penalizing = false;
    _this.penaltyPosition = 0;
    _this.penaltyLast = 0;

    _this.voidCount = 0;
    _this.voidLength = 3;

    _this.matchesLeft = options.matches;

    _this.isRunning = true;

    _this.tickSpeed = options.tickSpeed;

    return _this;
  }

  _createClass(LogicSystem, [{
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {}
  }, {
    key: 'update',
    value: function update(dt) {
      if (!this.isRunning) return;

      var ticks;
      var s = this.tickSpeed;
      var cs = this.tickSpeed * 2;

      // Update the penalty timer
      this.dropTimerLast += dt;
      if (this.dropTimerLast >= s) {
        ticks = 0;

        while (this.dropTimerLast >= s) {
          ticks += 1;
          this.dropTimerLast -= s;
        }

        if (ticks > 0) {
          this.dropTimerPosition -= ticks;
          if (this.dropTimerPosition <= 0) {
            this.drop();
            this.dropTimerPosition = this.dropTimerLength;
          }
          if (this.dropTimerCallback) {
            this.dropTimerCallback(this.dropTimerPosition);
          }
        }
      }

      // Update the combo meter
      /*
      if(this.comboMeterPosition != 0) {
        this.comboMeterLast += dt;
        if(this.comboMeterLast >= cs) {
          ticks = 0;
          while(this.comboMeterLast >= cs) {
            ticks += 1;
            this.comboMeterLast -= cs;
          }
            if(ticks > 0) {
            this.comboMeterPosition -= ticks;
            if(this.comboMeterPosition <= 0) {
              this.comboMeterPosition = 0;
              this.comboCount = 0;
            }
            if(this.comboMeterCallback) {
              this.comboMeterCallback(this.comboMeterPosition, this.comboCount);
            }
          }
        }
      }
      */
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.isRunning = false;
    }
  }, {
    key: 'start',
    value: function start() {
      this.isRunning = true;
    }
  }, {
    key: 'setDropTimerCallback',
    value: function setDropTimerCallback(callback) {
      this.dropTimerCallback = callback;
    }
  }, {
    key: 'setComboMeterCallback',
    value: function setComboMeterCallback(callback) {
      this.comboMeterCallback = callback;
    }
  }, {
    key: 'setMatchesCallback',
    value: function setMatchesCallback(callback) {
      this.matchesCallback = callback;
    }
  }, {
    key: 'setPenaltyCallback',
    value: function setPenaltyCallback(callback) {
      this.voidCallback = callback;
    }
  }, {
    key: 'handleMatch',
    value: function handleMatch(length) {

      // END GAME Detection
      if (this.matchesLeft <= length) {
        this.matchesLeft = 0;
        this.matchesCallback(this.matchesLeft);
        this.gameWin();
        return;
      }

      this.matchesLeft -= length;
      if (this.matchesCallback) {
        this.matchesCallback(this.matchesLeft);
      }

      this.voidCount = 0;
      // Send the updated void count
      if (this.voidCallback) {
        this.voidCallback(this.voidCount);
      }

      this.dropTimerPosition = this.dropTimerLength;
      if (this.dropTimerPosition > this.dropTimerLength) {
        this.dropTimerPosition = this.dropTimerLength;
      }
      if (this.dropTimerCallback) {
        this.dropTimerCallback(this.dropTimerPosition);
      }

      /*
      this.comboCount += 1;
      if(this.comboCount == 1) {
        // Start the combo timer
        this.comboMeterPosition = length;
        this.comboMeterLast = 0;
      } else {
        this.comboMeterPosition += length;
        if(this.comboMeterPosition > this.comboMeterLength) {
          this.comboMeterPosition = this.comboMeterLength;
        }
      }
      if(this.comboMeterCallback) {
        this.comboMeterCallback(this.comboMeterPosition, this.comboCount);
      }
      */
    }
  }, {
    key: 'handleNonmatch',
    value: function handleNonmatch() {
      this.voidCount += 1;
      if (this.voidCount >= this.voidLength) {
        // Penalty
        this.penalty();
        this.voidCount = 0;
      } else {}
      //

      // Send the updated void count
      if (this.voidCallback) {
        this.voidCallback(this.voidCount);
      }
    }
  }, {
    key: 'penalty',
    value: function penalty() {
      var gridSystem = this.engine.getSystem(_ComponentType2.default.GRID);
      var candies = LogicSystem.CANDY_PENALTY;
      var ring = 0;
      var spots;
      while (candies) {
        spots = [];
        gridSystem.iterateByRing(ring, function (x, y) {
          if (!gridSystem.hasAt(x, y)) {
            spots.push([x, y]);
          }
        });

        var added = 0;
        for (var i = 0; i < candies; i++) {
          if (spots.length == 0) break;
          var ri = Math.floor(Math.random() * spots.length);
          var spot = spots.splice(ri, 1)[0];
          var candy = _ObjectFactory2.default.Create(_GameObjectType2.default.CANDY, {
            //           "candyType": this.engine.randomCandy(),
            //           "x": spot[0],
            "y": spot[1]
          });
          this.engine.addObject(candy);
          added += 1;
        }

        candies -= added;
        ring += 1;
      }

      gridSystem.findMaxDepth();

      var soundSystem = this.engine.getSystem(_ComponentType2.default.SOUND);
      soundSystem.playSound("sfx.time.penalty");
    }
  }, {
    key: 'drop',
    value: function drop() {
      console.log("DROP CURSOR PIECE");
      var event = new _EngineEvent2.default(_EngineEvent2.default.FORCE_DROP);
      this.dispatchEvent(event);
    }
  }, {
    key: 'getComboCount',
    value: function getComboCount() {
      return this.comboCount;
    }
  }, {
    key: 'gameWin',
    value: function gameWin() {
      // Logic to progress to the next level
      this.stop();
      var event = new _EngineEvent2.default(_EngineEvent2.default.GAME_WIN, null, null, null);
      this.dispatchEvent(event);
    }
  }]);

  return LogicSystem;
}(_EngineSystem3.default);

exports.default = LogicSystem;

},{"app/engine/enum/ComponentType":81,"app/engine/enum/GameObjectType":82,"app/engine/factory/ObjectFactory":85,"app/engine/system/EngineSystem":89,"app/event/EngineEvent":95}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineSystem2 = require('app/engine/system/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhysicsSystem = function (_EngineSystem) {
  _inherits(PhysicsSystem, _EngineSystem);

  function PhysicsSystem() {
    _classCallCheck(this, PhysicsSystem);

    var _this = _possibleConstructorReturn(this, (PhysicsSystem.__proto__ || Object.getPrototypeOf(PhysicsSystem)).call(this, _ComponentType2.default.PHYSICS));

    _this.updateStack = [];
    return _this;
  }

  _createClass(PhysicsSystem, [{
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {}
  }, {
    key: 'update',
    value: function update(dt) {
      this.updateComponents(dt);
    }
  }]);

  return PhysicsSystem;
}(_EngineSystem3.default);

exports.default = PhysicsSystem;

},{"app/engine/enum/ComponentType":81,"app/engine/system/EngineSystem":89,"app/event/EngineEvent":95}],94:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EngineSystem2 = require('app/engine/system/EngineSystem');

var _EngineSystem3 = _interopRequireDefault(_EngineSystem2);

var _EngineEvent = require('app/event/EngineEvent');

var _EngineEvent2 = _interopRequireDefault(_EngineEvent);

var _ComponentType = require('app/engine/enum/ComponentType');

var _ComponentType2 = _interopRequireDefault(_ComponentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SoundSystem = function (_EngineSystem) {
  _inherits(SoundSystem, _EngineSystem);

  // soundProxy: null,

  function SoundSystem() {
    _classCallCheck(this, SoundSystem);

    return _possibleConstructorReturn(this, (SoundSystem.__proto__ || Object.getPrototypeOf(SoundSystem)).call(this, _ComponentType2.default.SOUND));
  }

  _createClass(SoundSystem, [{
    key: 'onAddedToEngine',
    value: function onAddedToEngine() {}
  }, {
    key: 'setSoundProxy',
    value: function setSoundProxy(soundProxy) {
      this.soundProxy = soundProxy;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      //this.updateComponents(dt);
    }
  }, {
    key: 'playSound',
    value: function playSound(id, options) {
      return this.soundProxy.playSound(id, options);
    }
  }]);

  return SoundSystem;
}(_EngineSystem3.default);

exports.default = SoundSystem;

},{"app/engine/enum/ComponentType":81,"app/engine/system/EngineSystem":89,"app/event/EngineEvent":95}],95:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EngineEvent = function (_minibot$event$Engine) {
  _inherits(EngineEvent, _minibot$event$Engine);

  function EngineEvent(type, object, component, data) {
    _classCallCheck(this, EngineEvent);

    return _possibleConstructorReturn(this, (EngineEvent.__proto__ || Object.getPrototypeOf(EngineEvent)).call(this, type, object, component, data));
  }

  return EngineEvent;
}(_minibot2.default.event.EngineEvent);

exports.default = EngineEvent;

},{"minibot":"minibot"}],96:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minibot = require("minibot");

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewEvent = function (_minibot$event$BaseEv) {
  _inherits(ViewEvent, _minibot$event$BaseEv);

  // eventName: null,

  // data: null,

  function ViewEvent(eventName, data) {
    _classCallCheck(this, ViewEvent);

    var _this = _possibleConstructorReturn(this, (ViewEvent.__proto__ || Object.getPrototypeOf(ViewEvent)).call(this, ViewEvent.EVENT_TYPE));

    _this.eventName = eventName;
    _this.data = data;
    return _this;
  }

  return ViewEvent;
}(_minibot2.default.event.BaseEvent);

ViewEvent.EVENT_TYPE = "ViewEvent";

ViewEvent.LEVEL_SELECTED = "LevelSelected";
ViewEvent.PLAY_SELECTED = "PlaySelected";
ViewEvent.OPTIONS_SELECTED = "OptionsSelected";
ViewEvent.BACK_SELECTED = "BackSelected";
ViewEvent.EXIT_SELECTED = "ExitSelected";

ViewEvent.GAME_EXIT = "GameExit";
ViewEvent.NEXT_STAGE = "NextStage";

exports.default = ViewEvent;

},{"minibot":"minibot"}],97:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _LevelVO = require('./vo/LevelVO');

var _LevelVO2 = _interopRequireDefault(_LevelVO);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import CandyType from 'app/engine/enum/CandyType';

var DataProxy = function (_puremvc$Proxy) {
  _inherits(DataProxy, _puremvc$Proxy);

  // completeCallback: null,
  // progressCallback: null,
  // isManagerLoaded: false,

  function DataProxy() {
    _classCallCheck(this, DataProxy);

    return _possibleConstructorReturn(this, (DataProxy.__proto__ || Object.getPrototypeOf(DataProxy)).call(this, DataProxy.NAME, DataProxy.DATA));
  }

  _createClass(DataProxy, [{
    key: 'initDataManager',
    value: function initDataManager(completeCallback, progressCallback) {
      this.isManagerLoaded = true;
      this.completeCallback = completeCallback;
      this.progressCallback = progressCallback;

      this.completeCallback();

      //this.loadStageData();
    }
  }, {
    key: 'getStages',
    value: function getStages() {
      var stages = [];
      this.data["Stages"].each(function (pair) {
        stages.push(pair.value);
      }.bind(this));

      return stages;
    }
  }, {
    key: 'getLevel',
    value: function getLevel(levelNum) {
      /*
        Level Data Struct
        - level
        - candyTypes
        - initialRows
        - matches
        - tickSpeed
      */
      // var candyTypeEnd = 4;
      // if(levelNum < 5) {
      //   candyTypeEnd += levelNum - 1;
      // } else {
      //   candyTypeEnd = 8;
      // }
      // var candyTypes = [
      //   CandyType.A,
      //   CandyType.B,
      //   CandyType.C,
      //   CandyType.D,
      //   CandyType.E,
      //   CandyType.F,
      //   CandyType.G
      // ].slice(0, candyTypeEnd);

      // var initialRows = 3;
      // if(levelNum < 6) {
      //   initialRows += Math.floor(levelNum/2);
      // } else {
      //   initialRows = 6
      // }

      var levelData = {
        //     'level': levelNum,
        //     'candyTypes': candyTypes,
        //     'initialRows': initialRows,
        //     'matches': 15 + (levelNum*5),
        'tickSpeed': 800
      };

      return new _LevelVO2.default(levelData);
    }

    /*
    getNextStage(stageId)
    {
      return this.getStage(stageId+1);
    }
      loadStageData()
    {
      var url = DataProxy.PATH + DataProxy.STAGE_DATA;
      new Ajax.Request(url, {
    //       method: 'get',
    //       evalJS: false,
    //       evalJSON: false,
    //       onSuccess: this.onLoadStageDataSuccess.bindAsEventListener(this),
          onFailure: this.onLoadStageDataFailure.bindAsEventListener(this)
      });
    }
      onLoadStageDataSuccess(transport)
    {
      this.updateProgress(0.03);
      var stagesArray = transport.responseText.evalJSON(true);
      for(var i = 0; i < stagesArray.length; i++) {
        var stageData = stagesArray[i];
        stageData.src = DataProxy.PATH + stageData.src;
        var stage = new StageVO(stageData);
        this.data["Stages"].set(stage.id, stage);
        this.updateProgress(0.04 / stagesArray.length);
      }
        this.loadStageFiles();
    }
      onLoadStageDataFailure()
    {
    }
      loadStageFiles()
    {
      this.data["Stages"].each(function(pair) {
        var stage = pair.value;
        this.loadStageFile(stage);
      }.bind(this));
    }
      loadStageFile(stage)
    {
      var url = stage.src;
      new Ajax.Request(url, {
    //       method: 'get',
    //       evalJS: false,
    //       evalJSON: false,
    //       onSuccess: this.onLoadStageFileSuccess.bindAsEventListener(this, stage),
          onFailure: this.onLoadStageFileFailure.bindAsEventListener(this, stage)
      });
    }
      onLoadStageFileSuccess(transport, stage)
    {
      var data = transport.responseText.evalJSON(true);
      stage.setStageData(data);
      this.isStageFileLoadingComplete();
    }
      onLoadStageFileFailure(transport, stage)
    {
      // ERROR
      stage.setStageData({});
      this.isStageFileLoadingComplete();
    }
      isStageFileLoadingComplete()
    {
      var complete = true;
      this.data["Stages"].each(function(pair) {
        var stage = pair.value;
        if(stage.loaded == false) {
          complete = false;
        }
      }.bind(this));
        if(complete) {
        this.completeCallback();
      }
    }
    */

  }, {
    key: 'updateProgress',
    value: function updateProgress(progress) {
      this.progressCallback(progress);
    }
  }]);

  return DataProxy;
}(_puremvc2.default.Proxy);

DataProxy.NAME = "DataProxy";
DataProxy.PATH = 'data/';
DataProxy.STAGE_DATA = 'stages.json';
DataProxy.DATA = {
  'Stages': {}
};

exports.default = DataProxy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./vo/LevelVO":101}],98:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

var _TemplateResource = require('app/resource/TemplateResource');

var _TemplateResource2 = _interopRequireDefault(_TemplateResource);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResourceManager = _minibot2.default.resource.ResourceManager,
    ImageResource = _minibot2.default.resource.ImageResource,
    SpriteResource = _minibot2.default.resource.SpriteResource,
    AnimationResource = _minibot2.default.resource.AnimationResource,
    Utils = _minibot2.default.core.Utils,
    Ajax = _minibot2.default.network.Ajax;

var ResourceProxy = function (_puremvc$Proxy) {
  _inherits(ResourceProxy, _puremvc$Proxy);

  // resourceManager: null,

  // completeCallback: null,
  // progressCallback: null,
  // isManagerLoaded: false,

  function ResourceProxy() {
    _classCallCheck(this, ResourceProxy);

    var _this = _possibleConstructorReturn(this, (ResourceProxy.__proto__ || Object.getPrototypeOf(ResourceProxy)).call(this, ResourceProxy.NAME, null));

    _this.resourceManager = ResourceManager.getInstance(ResourceProxy.RESOURCE_KEY);
    return _this;
  }

  _createClass(ResourceProxy, [{
    key: 'getResource',
    value: function getResource(type, id) {
      return this.resourceManager.getResource(type, id);
    }
  }, {
    key: 'getTemplate',
    value: function getTemplate(id) {
      return this.resourceManager.getResource(_ResourceType2.default.TEMPLATE, id);
    }
  }, {
    key: 'initResourceManager',
    value: function initResourceManager(completeCallback, progressCallback) {
      this.isManagerLoaded = true;
      this.progressCallback = progressCallback;
      this.completeCallback = completeCallback;

      this.resourceManager.addType(_ResourceType2.default.TEMPLATE, _TemplateResource2.default);
      this.resourceManager.addType(_ResourceType2.default.IMAGE, ImageResource);
      this.resourceManager.addType(_ResourceType2.default.SPRITE, SpriteResource);
      this.resourceManager.addType(_ResourceType2.default.ANIMATION, AnimationResource);

      this.loadTemplateData();

      //this.completeCallback();
    }
  }, {
    key: 'loadTemplateData',
    value: function loadTemplateData() {
      var url = 'data/templates.json';
      new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadTemplateDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadTemplateDataFailure, this)
      });
    }
  }, {
    key: 'onLoadTemplateDataSuccess',
    value: function onLoadTemplateDataSuccess(transport) {

      // Strip inline comments before evaluating the JSON
      var templates = JSON.parse(this.stripComments(transport.responseText));

      for (var i = 0; i < templates.length; i++) {
        var template = templates[i];
        template.src = ResourceProxy.TEMPLATE_URL + template.src;
        var id = template.id;
        this.resourceManager.addResource(_ResourceType2.default.TEMPLATE, id, template);
      }

      this.loadImageData();
    }
  }, {
    key: 'onLoadTemplateDataFailure',
    value: function onLoadTemplateDataFailure() {
      // TODO: Error
    }
  }, {
    key: 'loadImageData',
    value: function loadImageData() {
      var url = 'data/images.json';
      new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadImageDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadImageDataFailure, this)
      });
    }
  }, {
    key: 'onLoadImageDataSuccess',
    value: function onLoadImageDataSuccess(transport) {
      var images = JSON.parse(transport.responseText);

      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        var id = image.id;
        this.resourceManager.addResource(_ResourceType2.default.IMAGE, id, image);
      }
      this.loadSpriteData();
    }
  }, {
    key: 'onLoadImageDataFailure',
    value: function onLoadImageDataFailure() {}
  }, {
    key: 'loadSpriteData',
    value: function loadSpriteData() {
      var url = 'data/sprites.json';
      new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadSpriteDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadSpriteDataFailure, this)
      });
    }
  }, {
    key: 'onLoadSpriteDataSuccess',
    value: function onLoadSpriteDataSuccess(transport) {
      var sprites = JSON.parse(transport.responseText);

      for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        var id = sprite.id;
        this.resourceManager.addResource(_ResourceType2.default.SPRITE, id, sprite);
      }

      this.loadAnimationData();
    }
  }, {
    key: 'onLoadSpriteDataFailure',
    value: function onLoadSpriteDataFailure() {}
  }, {
    key: 'loadAnimationData',
    value: function loadAnimationData() {
      var url = 'data/animations.json';
      new Ajax.Request(url, {
        method: 'get',
        evalJS: false,
        evalJSON: false,
        onSuccess: Utils.BindAsEventListener(this.onLoadAnimationDataSuccess, this),
        onFailure: Utils.BindAsEventListener(this.onLoadAnimationDataFailure, this)
      });
    }
  }, {
    key: 'onLoadAnimationDataSuccess',
    value: function onLoadAnimationDataSuccess(transport) {
      var animations = JSON.parse(transport.responseText);

      for (var i = 0; i < animations.length; i++) {
        var animation = animations[i];
        var id = animation.id;
        this.resourceManager.addResource(_ResourceType2.default.ANIMATION, id, animation);
      }

      this.loadAllResources();
    }
  }, {
    key: 'onLoadAnimationDataFailure',
    value: function onLoadAnimationDataFailure() {}
  }, {
    key: 'loadAllResources',
    value: function loadAllResources() {
      this.resourceManager.loadAll(Utils.Bind(function (progress) {
        this.progressCallback(progress);
      }, this), Utils.BindAsEventListener(this.handleLoadAllResourcesComplete, this));
    }
  }, {
    key: 'handleLoadAllResourcesComplete',
    value: function handleLoadAllResourcesComplete() {
      this.completeCallback();
    }

    /**
     *  Utility Functions
     */

  }, {
    key: 'stripComments',
    value: function stripComments(str) {
      // strips inline comments only
      str = str.replace(/\/\/.*\n/g, '');
      return str;
    }
  }]);

  return ResourceProxy;
}(_puremvc2.default.Proxy);

ResourceProxy.NAME = "ResourceProxy";
ResourceProxy.RESOURCE_KEY = "ResourceKey";
ResourceProxy.LOADED = false;
ResourceProxy.TEMPLATE_JSON = "data/templates.json";
ResourceProxy.TEMPLATE_URL = "tpl/";

exports.default = ResourceProxy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/resource/ResourceType":102,"app/resource/TemplateResource":103,"http":27,"minibot":"minibot"}],99:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import SoundJS from 'SoundJS';

var SoundProxy = function (_puremvc$Proxy) {
  _inherits(SoundProxy, _puremvc$Proxy);

  // completeCallback: null,
  // progressCallback: null,
  // isManagerLoaded: false,

  // soundCount: 0,
  // loadCount: 0,

  // bgm: null,

  function SoundProxy() {
    _classCallCheck(this, SoundProxy);

    return _possibleConstructorReturn(this, (SoundProxy.__proto__ || Object.getPrototypeOf(SoundProxy)).call(this, SoundProxy.NAME, SoundProxy.DATA));
  }

  _createClass(SoundProxy, [{
    key: 'hasSound',
    value: function hasSound(id) {
      return id in SoundProxy.DATA['Sounds'];
    }
  }, {
    key: 'playSound',
    value: function playSound(id, options) {
      if (!this.hasSound(id)) return;
      if (options == undefined) options = {};
      return SoundJS.play(id, options);
    }
  }, {
    key: 'stopSound',
    value: function stopSound(id) {
      var sound = this.getSound(id);
      if (sound == undefined) return;
      sound.stop();
    }
  }, {
    key: 'setBgm',
    value: function setBgm(id) {
      if (!this.hasSound(id)) return;

      // Stop the current BGM
      if (this.bgm != null) {
        if (this.bgm.id != id) {
          this.fadeOutBgm(this.bgm, 0.6);
        } else {
          return;
        }
      }

      var options = {};
      options.loop = -1;
      options.volume = 0;

      this.bgm = SoundJS.play(id, options);
      this.fadeInBgm(this.bgm, 0);
    }
  }, {
    key: 'fadeOutBgm',
    value: function fadeOutBgm(sound, vol) {
      vol -= 0.02;
      sound.setVolume(vol);
      if (vol <= 0) {
        sound.setVolume(0);
        sound.pause();
      } else {
        this.fadeOutBgm.bind(this, sound, vol).delay(0.1);
      }
    }
  }, {
    key: 'fadeInBgm',
    value: function fadeInBgm(sound, vol) {
      vol += 0.02;
      sound.setVolume(vol);
      if (vol >= 0.6) {
        sound.setVolume(0.6);
      } else {
        this.fadeInBgm.bind(this, sound, vol).delay(0.1);
      }
    }
  }, {
    key: 'initSoundManager',
    value: function initSoundManager(completeCallback, progressCallback) {
      this.isManagerLoaded = true;
      this.completeCallback = completeCallback;
      this.progressCallback = progressCallback;

      SoundJS.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
      SoundJS.alternateExtensions = ["mp3"];

      this.loadSoundData();
      /*
      SoundManager.setup({
      //     url: SoundProxy.PATH_TO_SWF,
        flashVersion: 9, // optional: shiny features (default = 8)
        useFlashBlock: false, // optionally, enable when you're ready to dive in
        /**
        * read up on HTML5 audio support, if you're feeling adventurous.
        * iPad/iPhone and devices without flash installed will always attempt to use it.
          onready()
        {
          this.loadSoundData();
        }.bind(this)
      });
      */
    }
  }, {
    key: 'loadSoundData',
    value: function loadSoundData() {
      var url = SoundProxy.SOUND_DATA;
      new Ajax.Request(url, {
        //       method: 'get',
        //       evalJS: false,
        //       evalJSON: false,
        //       onSuccess: this.onLoadSoundDataSuccess.bindAsEventListener(this),
        onFailure: this.onLoadSoundDataFailure.bindAsEventListener(this)
      });
    }
  }, {
    key: 'onLoadSoundDataSuccess',
    value: function onLoadSoundDataSuccess(transport) {
      var sounds = transport.responseText.evalJSON();

      this.soundCount = sounds.length;

      SoundJS.addEventListener("fileload", this.onLoadSoundFile.bindAsEventListener(this));

      for (var i = 0; i < sounds.length; i++) {
        var sound = sounds[i];
        SoundJS.registerSound(sound.src, sound.id);
        /*
        var object;
        if(sound.type == SoundProxy.SFX_TYPE) {
          object = SoundManager.createSound({
        //         id: sound.id,
        //         url: sound.src,
        //         onload: this.onLoadSoundFile.bind(this),
            autoLoad: true
          });
        } else {
          object = SoundManager.createSound({
        //         id: sound.id,
            url: sound.src
          });
          this.loadCount++;
        }
        this.data['Sounds'].set(sound.id, object);
        */
      }
    }
  }, {
    key: 'onLoadSoundDataFailure',
    value: function onLoadSoundDataFailure() {
      // TODO: Error
    }
  }, {
    key: 'onLoadSoundFile',
    value: function onLoadSoundFile(event) {
      // This is fired for each sound that is registered.
      //var instance = createjs.Sound.play(event.src);  // play using id.  Could also use full source path or event.src.
      //instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
      this.data['Sounds'][event.id] = true;

      //instance.volume = 0.5;
      this.loadCount++;
      console.log(this.loadCount);
      if (this.loadCount == this.soundCount) {
        this.completeCallback();
      }
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress(progress) {
      this.progressCallback(progress);
    }
  }]);

  return SoundProxy;
}(_puremvc2.default.Proxy);

exports.default = SoundProxy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseVO = function BaseVO(data) {
  _classCallCheck(this, BaseVO);

  for (var key in data) {
    if (this[key] !== undefined) {
      this[key] = data[key];
    }
  }
};

exports.default = BaseVO;

},{}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseVO2 = require('./BaseVO');

var _BaseVO3 = _interopRequireDefault(_BaseVO2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LevelVO = function (_BaseVO) {
  _inherits(LevelVO, _BaseVO);

  // level: null,
  // candyTypes: null,
  // initialRows: null,
  // matches: null,
  // tickSpeed: null,

  function LevelVO(data) {
    _classCallCheck(this, LevelVO);

    return _possibleConstructorReturn(this, (LevelVO.__proto__ || Object.getPrototypeOf(LevelVO)).call(this, data));
  }

  return LevelVO;
}(_BaseVO3.default);

exports.default = LevelVO;

},{"./BaseVO":100}],102:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  IMAGE: _minibot2.default.resource.ImageResource.TYPE,
  SPRITE: _minibot2.default.resource.SpriteResource.TYPE,
  ANIMATION: _minibot2.default.resource.AnimationResource.TYPE,
  SFX: 11,
  BGM: 12,
  TEMPLATE: 13
};

},{"minibot":"minibot"}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ResourceType = require('app/resource/ResourceType');

var _ResourceType2 = _interopRequireDefault(_ResourceType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ajax = _minibot2.default.network.Ajax,
    Utils = _minibot2.default.core.Utils;

var TemplateResource = function (_minibot$resource$Res) {
  _inherits(TemplateResource, _minibot$resource$Res);

  function TemplateResource(id, data) {
    _classCallCheck(this, TemplateResource);

    var _this = _possibleConstructorReturn(this, (TemplateResource.__proto__ || Object.getPrototypeOf(TemplateResource)).call(this, id));

    _this.src = null;
    _this.data = null;
    if (data !== undefined || data !== null) {
      _this.data = data;
      _this.src = data.src;
    }
    return _this;
  }

  _createClass(TemplateResource, [{
    key: 'load',
    value: function load(manager, callback) {
      this.loaded = true;
      if (this.src !== null) {
        new Ajax.Request(this.src, {
          method: 'get',
          evalJS: false,
          evalJSON: false,
          onSuccess: Utils.BindAsEventListener(this.onSuccess, this, callback),
          onFailure: Utils.BindAsEventListener(this.onFailure, this, callback)
        });
      } else {
        callback();
      }
    }
  }, {
    key: 'onSuccess',
    value: function onSuccess(response, callback) {
      this.data = response.responseText;
      callback();
    }
  }, {
    key: 'onFailure',
    value: function onFailure(response, callback) {
      console.log('TemplateResource: Failed to template - ' + this.src);
      callback();
    }
  }]);

  return TemplateResource;
}(_minibot2.default.resource.Resource);

exports.default = TemplateResource;

},{"app/resource/ResourceType":102,"minibot":"minibot"}],104:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _minibot = require('minibot');

var _minibot2 = _interopRequireDefault(_minibot);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = _minibot2.default.core.Utils;

var BaseMediator = function (_puremvc$Mediator) {
  _inherits(BaseMediator, _puremvc$Mediator);

  function BaseMediator(name, viewComponent) {
    _classCallCheck(this, BaseMediator);

    var _this = _possibleConstructorReturn(this, (BaseMediator.__proto__ || Object.getPrototypeOf(BaseMediator)).call(this, name, viewComponent));

    _this.viewEventBfx = Utils.Bind(_this.handleViewEvent, _this);
    return _this;
  }

  _createClass(BaseMediator, [{
    key: 'onRegister',
    value: function onRegister() {
      this.viewComponent.addEventListener(_ViewEvent2.default.EVENT_TYPE, this.viewEventBfx);
    }
  }, {
    key: 'onRemove',
    value: function onRemove() {
      this.viewComponent.removeEventListener(_ViewEvent2.default.EVENT_TYPE, this.viewEventBfx);
      this.viewEventBfx = null;
      this.viewComponent = null;
    }
  }, {
    key: 'handleViewEvent',
    value: function handleViewEvent(event) {
      var eventName = event.eventName;
      var data = event.data;
      switch (eventName) {
        default:
          break;
      }
    }
  }]);

  return BaseMediator;
}(_puremvc2.default.Mediator);

exports.default = BaseMediator;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/event/ViewEvent":96,"minibot":"minibot"}],105:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMediator2 = require('app/view/BaseMediator');

var _BaseMediator3 = _interopRequireDefault(_BaseMediator2);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameMediator = function (_BaseMediator) {
  _inherits(GameMediator, _BaseMediator);

  function GameMediator(viewComponent) {
    _classCallCheck(this, GameMediator);

    return _possibleConstructorReturn(this, (GameMediator.__proto__ || Object.getPrototypeOf(GameMediator)).call(this, GameMediator.NAME, viewComponent));
  }

  _createClass(GameMediator, [{
    key: 'handleViewEvent',
    value: function handleViewEvent(event) {
      var eventName = event.eventName;
      var data = event.data;
      switch (eventName) {
        case _ViewEvent2.default.EXIT_SELECTED:
          this.handlePlaySelected();
          break;
        case _ViewEvent2.default.NEXT_STAGE:
          this.handleNextStage(data);
          break;
        case _ViewEvent2.default.GAME_EXIT:
          this.handleGameExit();
          break;
        default:
          break;
      }
    }
  }, {
    key: 'handlePlaySelected',
    value: function handlePlaySelected() {
      this.sendNotification(_ApplicationConstants2.default.LOAD_GAME);
      this.facade.removeMediator(this.getMediatorName());
    }
  }, {
    key: 'handleOptionsSelected',
    value: function handleOptionsSelected() {
      this.sendNotification(_ApplicationConstants2.default.LOAD_OPTIONS);
      this.facade.removeMediator(this.getMediatorName());
    }
  }, {
    key: 'handleNextStage',
    value: function handleNextStage(level) {
      var nextLevel = level.level + 1;
      var tmpFacade = this.facade;
      this.facade.removeMediator(this.getMediatorName());

      tmpFacade.sendNotification(_ApplicationConstants2.default.LOAD_GAME, nextLevel);
    }
  }, {
    key: 'handleGameExit',
    value: function handleGameExit() {
      this.sendNotification(_ApplicationConstants2.default.LOAD_TITLE);
      this.facade.removeMediator(this.getMediatorName());
    }
  }]);

  return GameMediator;
}(_BaseMediator3.default);

exports.default = GameMediator;

},{"app/ApplicationConstants":37,"app/event/ViewEvent":96,"app/view/BaseMediator":104}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMediator2 = require('app/view/BaseMediator');

var _BaseMediator3 = _interopRequireDefault(_BaseMediator2);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionsMediator = function (_BaseMediator) {
  _inherits(OptionsMediator, _BaseMediator);

  function OptionsMediator(viewComponent) {
    _classCallCheck(this, OptionsMediator);

    return _possibleConstructorReturn(this, (OptionsMediator.__proto__ || Object.getPrototypeOf(OptionsMediator)).call(this, OptionsMediator.NAME, viewComponent));
  }

  _createClass(OptionsMediator, [{
    key: 'handleViewEvent',
    value: function handleViewEvent(event) {
      var eventName = event.eventName;
      var data = event.data;
      switch (eventName) {
        case _ViewEvent2.default.BACK_SELECTED:
          this.handleBackSelected();
          break;
        default:
          break;
      }
    }
  }, {
    key: 'handleBackSelected',
    value: function handleBackSelected() {
      this.sendNotification(_ApplicationConstants2.default.LOAD_TITLE);
      this.facade.removeMediator(this.getMediatorName());
    }
  }]);

  return OptionsMediator;
}(_BaseMediator3.default);

OptionsMediator.NAME = "OptionsMediator";

exports.default = OptionsMediator;

},{"app/ApplicationConstants":37,"app/event/ViewEvent":96,"app/view/BaseMediator":104}],107:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puremvc = (typeof window !== "undefined" ? window['puremvc'] : typeof global !== "undefined" ? global['puremvc'] : null);

var _puremvc2 = _interopRequireDefault(_puremvc);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShellMediator = function (_puremvc$Mediator) {
  _inherits(ShellMediator, _puremvc$Mediator);

  function ShellMediator(viewComponent, options) {
    _classCallCheck(this, ShellMediator);

    console.log("ShellMediator::constructor");

    var _this = _possibleConstructorReturn(this, (ShellMediator.__proto__ || Object.getPrototypeOf(ShellMediator)).call(this, ShellMediator.NAME, viewComponent));

    _this.options = options;
    return _this;
  }

  _createClass(ShellMediator, [{
    key: 'listNotificationInterests',
    value: function listNotificationInterests() {
      return [_ApplicationConstants2.default.SHOW_VIEW, _ApplicationConstants2.default.EXIT_APP];
    }
  }, {
    key: 'handleNotification',
    value: function handleNotification(notification) {
      var name = notification.getName();
      var body = notification.getBody();
      switch (name) {
        case _ApplicationConstants2.default.SHOW_VIEW:
          this.handleShowView(body);
          break;
        case _ApplicationConstants2.default.EXIT_APP:
          this.handleExitApp(body);
          break;
      }
    }
  }, {
    key: 'handleShowView',
    value: function handleShowView(view) {
      this.viewComponent.addChild(view);
    }
  }, {
    key: 'handleExitApp',
    value: function handleExitApp(body) {
      console.log('ShellMediator::handleExitApp');
      if ('exitCallback' in this.options) {
        this.options.exitCallback();
      }
    }
  }]);

  return ShellMediator;
}(_puremvc2.default.Mediator);

exports.default = ShellMediator;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"app/ApplicationConstants":37}],108:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMediator2 = require('app/view/BaseMediator');

var _BaseMediator3 = _interopRequireDefault(_BaseMediator2);

var _ApplicationConstants = require('app/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _ViewEvent = require('app/event/ViewEvent');

var _ViewEvent2 = _interopRequireDefault(_ViewEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TitleMediator = function (_BaseMediator) {
  _inherits(TitleMediator, _BaseMediator);

  function TitleMediator(viewComponent) {
    _classCallCheck(this, TitleMediator);

    return _possibleConstructorReturn(this, (TitleMediator.__proto__ || Object.getPrototypeOf(TitleMediator)).call(this, TitleMediator.NAME, viewComponent));
  }

  _createClass(TitleMediator, [{
    key: 'handleViewEvent',
    value: function handleViewEvent(event) {
      var eventName = event.eventName;
      var data = event.data;
      switch (eventName) {
        case _ViewEvent2.default.LEVEL_SELECTED:
          this.handleLevelSelected(data);
          break;
        case _ViewEvent2.default.EXIT_SELECTED:
          this.handleExitSelected();
          break;
        default:
          break;
      }
    }
  }, {
    key: 'handleLevelSelected',
    value: function handleLevelSelected(level) {
      this.sendNotification(_ApplicationConstants2.default.LOAD_GAME, level);
      this.facade.removeMediator(this.getMediatorName());
    }
  }, {
    key: 'handleExitSelected',
    value: function handleExitSelected() {
      console.log('TitleMediator::handleExitSelected');
      this.sendNotification(_ApplicationConstants2.default.EXIT_APP);
    }
  }]);

  return TitleMediator;
}(_BaseMediator3.default);

TitleMediator.NAME = "TitleMediator";

exports.default = TitleMediator;

},{"app/ApplicationConstants":37,"app/event/ViewEvent":96,"app/view/BaseMediator":104}],"app":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var app = {};

// App
app.ApplicationFacade = require('app/ApplicationFacade').default;
app.ApplicationConstants = require('app/ApplicationConstants').default;

// Common
app.common = {};
//app.common = require('app/common').default;

// Display
app.display = {};
app.display.Shell = require('app/display/Shell').default;

// Controller
app.controller = {};
app.controller.ManagerPrepCommand = require('app/controller/ManagerPrepCommand').default;
app.controller.ModelPrepCommand = require('app/controller/ModelPrepCommand').default;
app.controller.StartupCommand = require('app/controller/StartupCommand').default;
app.controller.ViewPrepCommand = require('app/controller/ViewPrepCommand').default;

// Models
app.model = {};
app.model.DataProxy = require('app/model/DataProxy').default;
app.model.ResourceProxy = require('app/model/ResourceProxy').default;

// Views
app.view = {};
app.view.ShellMediator = require('app/view/ShellMediator').default;

exports.default = app;

},{"app/ApplicationConstants":37,"app/ApplicationFacade":38,"app/controller/ManagerPrepCommand":45,"app/controller/ModelPrepCommand":47,"app/controller/StartupCommand":49,"app/controller/ViewPrepCommand":51,"app/display/Shell":55,"app/model/DataProxy":97,"app/model/ResourceProxy":98,"app/view/ShellMediator":107}]},{},[]);
