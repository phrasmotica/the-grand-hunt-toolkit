import { Tab } from "semantic-ui-react"

import { RoaminAround } from "./RoaminAround"

import "./App.css"

const panes = [
    {
        menuItem: "Roamin' Around",
        render: () => <RoaminAround />
    }
]

const App = () => (
    <div className="App">
        <header className="App-header">
            <h1>The Grand Hunt Toolkit</h1>

            <h4>
                Some useful tools I created while tackling&nbsp;<a href="https://grandhuntdigital.com/"><em>The Grand Hunt</em></a>&nbsp;with my team <a href="https://grandhuntdigital.com/team/The+Super+Egos"><em>The Super Egos</em></a>.
            </h4>

            <Tab menu={{ pointing: true }} panes={panes} />
        </header>
    </div>
)

export default App
