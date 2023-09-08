import { NavLink } from "react-router-dom"
import Rounds from "./Rounds"
import SalesView from "./SalesView"

export default function RoundView () {
    return (
        <div>
            <h2>Round Summary</h2>
            <NavLink></NavLink>
            <Rounds />
            <SalesView/>
        </div>
    )
}