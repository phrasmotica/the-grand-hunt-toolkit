import { useState } from "react"
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown"

type Dict = { [key: string]: string }

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

    const coloursDict: Dict = {
        "r": "Red",
        "o": "Orange",
        "y": "Yellow",
        "b": "Blue",
        "g": "Green",
    }

    const shapesDict: Dict = {
        "h": "Hexagon",
        "s": "Star",
        "p": "Pentagon",
        "c": "Circle",
        "q": "Square",
        "t": "Triangle",
        "m": "Crescent",
    }

    const generateOptions = (textDict: Dict, index: 0 | 1) => [...new Set(data.flatMap(r => r).map(s => s[index]))]
        .sort((x, y) => x.localeCompare(y))
        .map(x => ({
            key: x,
            value: x,
            text: textDict[x] + ` (${x})`,
        }))

    const colours = generateOptions(coloursDict, 0)
    const shapes = generateOptions(shapesDict, 1)

    const getText = (cell: string) => {
        if (!colour || !shape) {
            return cell
        }

        if (cell[0] === colour || cell[1] === shape) {
            return cell
        }

        return ""
    }

    const renderRow = (row: string[], index: number) => (
        <div key={index} className="row">
            {row.map(renderCell)}
        </div>
    )

    const renderCell = (cell: string, index: number) => (
        <div key={index} className="cell">
            <span>{getText(cell)}</span>
        </div>
    )

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
                {data.map(renderRow)}
            </div>
        </div>
    )
}
