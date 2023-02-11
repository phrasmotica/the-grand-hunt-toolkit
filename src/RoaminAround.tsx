import { useState } from "react"
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown"

export const RoaminAround = () => {
    const [colour, setColour] = useState("")
    const [shape, setShape] = useState("")

    const data = [
        ["rh", "os", "yp", "bc", "gs", "oc", "bq", "rp", "oc", "yh"],
        ["os", "bc", "rt", "yh", "rc", "yp", "os", "yh", "bm", "rt"],
        ["bm", "op", "yp", "rm", "bq", "gm", "rq", "gp", "rs", "oc"],
        ["rq", "gc", "bq", "oc", "yq", "bs", "oh", "yq", "gp", "bh"],
        ["op", "rh", "gp", "rm", "gh", "ym", "rt", "bc", "oq", "om"],
        ["bh", "bt", "gt", "oq", "gs", "rc", "gq", "rp", "gh", "bq"],
        ["yt", "rm", "oc", "rp", "bm", "op", "ys", "bc", "om", "rh"],
        ["oh", "bc", "rh", "om", "ys", "bt", "rp", "bt", "rq", "oc"],
        ["bc", "ot", "bs", "yc", "rp", "oq", "yc", "rh", "gp", "op"],
        ["op", "ot", "rm", "op", "bc", "yc", "gp", "bm", "oq", "bs"],
    ]

    const colourMap: { [id: string]: string } = {
        "r": "Red",
        "o": "Orange",
        "y": "Yellow",
        "b": "Blue",
        "g": "Green",
    }

    const shapeMap: { [id: string]: string } = {
        "h": "Hexagon",
        "s": "Star",
        "p": "Pentagon",
        "c": "Circle",
        "q": "Square",
        "t": "Triangle",
        "m": "Crescent",
    }

    const colours = [...new Set(data.flatMap(r => r).map(c => c[0]))].sort((x, y) => x.localeCompare(y)).map(c => ({
        key: c,
        value: c,
        text: colourMap[c] + ` (${c})`,
    }))

    const shapes = [...new Set(data.flatMap(r => r).map(c => c[1]))].sort((x, y) => x.localeCompare(y)).map(s => ({
        key: s,
        value: s,
        text: shapeMap[s] + ` (${s})`,
    }))

    const shouldShow = (cell: string) => {
        if (!colour || !shape) {
            return true
        }

        return cell[0] === colour || cell[1] === shape
    }

    return (
        <div className="container">
            <div className="options">
                <Dropdown
                    fluid
                    selection
                    placeholder="Colour..."
                    options={colours}
                    value={colour}
                    onChange={(e, data) => setColour(data.value as string)} />

                <div id="orLabel">
                    <p>OR</p>
                </div>

                <Dropdown
                    fluid
                    selection
                    placeholder="Shape..."
                    options={shapes}
                    value={shape}
                    onChange={(e, data) => setShape(data.value as string)} />
            </div>

            <div className="grid">
                {data.map((r, i) => (
                    <div key={i} className="row">
                        {r.map((c, j) => {
                            let text = ""
                            if (shouldShow(c)) {
                                text = c
                            }

                            return (
                                <div key={j} className="cell">
                                    <span>{text}</span>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
