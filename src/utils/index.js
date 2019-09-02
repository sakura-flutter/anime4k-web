export function downloadImg(src) {
  const a = document.createElement('a')
  a.href = src
  a.setAttribute('target', '_blank')
  a.setAttribute('download', 'picture')
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    a.remove()
  }, 200)
}
