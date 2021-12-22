import Dropzone, { Input, Preview, SubmitButton } from '../src/Dropzone'
import { formatBytes, formatDuration, accepts, defaultClassNames, mergeStyles } from '../src/utils'

test('formatBytes', () => {
  expect(formatBytes(2000)).toEqual('2.0kB')
})

test('formatBytes', () => {
  expect(formatBytes(1024 * 1024 * 1.5)).toEqual('1.5MB')
})

test('formatDuration', () => {
  expect(formatDuration(1000)).toEqual('16:40')
})

test('accepts', () => {
  const file = { name: 'image.png', type: 'image/png' }
  expect(accepts(file, '*')).toEqual(true)
  expect(accepts(file, '.png,.jpg')).toEqual(true)
  expect(accepts(file, 'image/*,video/*')).toEqual(true)
  expect(accepts(file, 'audio/*')).toEqual(false)
})

test('mergeStyles', () => {
  const _classNames = { dropzone: 'dz', inputLabel: v => v }
  const _styles = { dropzone: { color: 'red' } }
  const _addClassNames = { input: 'dz' }
  const { classNames, styles } = mergeStyles(_classNames, _styles, _addClassNames, 'name')

  expect(classNames.dropzone).toEqual('dz')
  expect(styles.dropzone).toEqual({ color: 'red' })
  expect(classNames.input).toEqual(`${defaultClassNames.input} dz`)
  expect(classNames.inputLabel).toEqual('name')
})
