import React from "react";
import { Link } from "react-router-dom";
import HomePage from "./pages/home";
import './template.css'

function TemplatePage(props) {
    return (
        <div>
            <div className="logo">
                RyanInspires
            </div>
            <nav className="page-nav">

                <Link to='/15'>Home</Link>


            </nav>

            <main>
                {props.children}

            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} RyanInspires | All rights reserved.</p>
            </footer>

        </div>

    )
}
export default TemplatePage