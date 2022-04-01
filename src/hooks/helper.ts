// 上传图片前的检查
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'format' | 'size' | null

export function beforeUploadCheck (file: File, conditon: CheckCondition) {
  const { format, size } = conditon
  const isFormat = format ? format.includes(file.type) : true
  const isSize = size ? (file.size / 1024 / 1024) : true
  let error: ErrorType = null
  if (!isFormat) {
    error = 'format'
  }
  if (!isSize) {
    error = 'size'
  }
  return {
    passed: isFormat && isSize,
    error
  }
}

// 数组转化为对象
export function arrToObj<T extends { _id?: string }> (arr: T[]) {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [index: string]: T })
}

// 对象转换为数组
export function objToArr<T> (obj: { [index: string]: T }) {
  return Object.keys(obj).map(item => obj[item])
}