import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [svgString, setSvgString] = useState('')
  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState([])
  useEffect(() => {
    if (!svgString && !loading) {
      fetch('/flemcoaster.svg')
        .then((res) => res.text())
        .then((svg) => {
          setSvgString(svg)
          setLoading(false)
        })
      setLoading(true)
    }
  }, [svgString, loading])
  const paths = document.querySelectorAll('#svgContainer path')
  useEffect(() => {
    if (paths && colors.length) {
      colors.forEach((c, i) => {
        paths[i].setAttribute('fill', c)
      })

      const canvas = document.querySelector('canvas')
      const data = new XMLSerializer().serializeToString(
        document.querySelector('#svgContainer svg')
      )
      const win = window.URL || window.webkitURL || window
      const img = new Image()

      const blob = new Blob([data], { type: 'image/svg+xml' })
      const url = win.createObjectURL(blob)
      img.setAttribute('src', url)
      img.addEventListener('load', () => {
        canvas.getContext('2d').drawImage(img, 0, 0)
        win.revokeObjectURL(url)
        const uri = canvas
          .toDataURL('image/png')
          .replace('image/png', 'octet/stream')
        const a = document.querySelector('#download')
        a.setAttribute('href', uri)
        a.setAttribute('download', 'flemcoaster.png')
      })
      //return () => window.URL.revokeObjectURL(uri)
    } else if (!colors.length) {
      setColors(
        Array.from(paths).map((p) => p.getAttribute('fill') || '#000000')
      )
    }
  }, [colors, paths])
  console.log(colors)
  return (
    <div className="App">
      <div
        style={{ opacity: 0, pointerEvents: 'none', position: 'absolute' }}
        id="svgContainer"
        dangerouslySetInnerHTML={{ __html: svgString }}
      ></div>
      <canvas
        style={{ width: '100vw' }}
        width="1116.606"
        height="612.147"
      ></canvas>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        {colors.length &&
          colors.map((p, i) => {
            const color = p && p.length === 4 ? p + p[3] + p[3] + p[3] : p
            return (
              <input
                type="color"
                onChange={(ev) => {
                  const newColors = [...colors]
                  newColors[i] = ev.target.value
                  setColors(newColors)
                }}
                value={color}
              />
            )
          })}
        <a id="download">Télécharger</a>
      </form>
    </div>
  )
}

export default App
