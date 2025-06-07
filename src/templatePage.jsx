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
                <div className="container">
                    <Link to='/15'>Questionaire</Link>
                    <Link to='/'>Home</Link>


                </div>

            </nav>

            <main>
                {props.children}

            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} RyanInspires | All rights reserved.</p>

                </div>
            </footer>

        </div>

    )
}
export default TemplatePage