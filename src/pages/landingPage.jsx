import React, { useState } from "react";
import TemplatePage from "../templatePage";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const [id, setId] = useState('')
    const navigate = useNavigate();

    function handleNavigation(e) {
        e.preventDefault();

        if (id.trim()) {
            navigate(`/${id}`)
        }
        else {
            alert('Enter a valid ID ')
        }
    }

    return (

        <TemplatePage>
            <div>
                <header>Welcome to my Questionaire website!</header>
                <p className="instructions">Select the ID of your choice and insert in the field below to generate the questionaire of that ID!</p>
                <form onSubmit={handleNavigation}>
                    <p>
                        <label> ID : </label>

                        <input
                            type="text"
                            className="idField"
                            value={id}
                            onChange={(e) => setId(e.target.value)} 
                        />
                    </p>
                    <button type="submit" className="id-btn" >Get Questionaire</button>

                </form>

            </div>
        </TemplatePage>
    )

}
export default LandingPage;