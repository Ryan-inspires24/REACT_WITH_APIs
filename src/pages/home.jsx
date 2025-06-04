import React, { useState } from "react";
import TemplatePage from "../templatePage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import '../questionairePage.css'

function HomePage() {
    const { id } = useParams();

    async function fetchQuestionaire(id) {
        const response = await fetch(`https://test.almamaters.club:9090/questionnaire/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch questionnaire number ' + id);
        }

        const data = await response.json();

        if (!data.data?.questions?.length) {
            throw new Error('No questions found');
        }

        const responses = data.data.questions.flatMap((question) => {
            return (question.settings?.responses || []).map((response) => ({
                ...response,
                questionnaireId: question.questionnaireId,
                questionId: question.id,
            }));
        });

        return responses;
    }
    const { formData, setFormData } = useState({})
    const { data, isLoading, isError } = useQuery({
        queryKey: ['questionnaire', id],
        queryFn: () => fetchQuestionaire(id),
    });

    function displayInput(response) {
        const inputProps = {
            name: response.input_key,
            required: response.required
        };
        switch (response.type) {
            case 'FREE_TEXT':
                return <textarea {...inputProps} placeholder="you can input multiple lines.."></textarea>
            case 'SIMPLE_TEXT':
                return <input {...inputProps} type="text" />
            case 'DATE_TIME':
                return <input {...inputProps} type='datetime-local' />
            default:
                return <textarea {...inputProps}></textarea>


        }
    }

    return (
        <TemplatePage>
            <header>Questionaire form</header>
            <p className="description">This is the questionnaire page number {id}.</p>

            {isLoading && <p>Questionnaire Loading...</p>}

            {isError && <p>Oops! Error loading this questionnaire.</p>}

            {data && (
                <form methods='POST' className="form-body">
                    {data.map((response) => (
                        <div key={response.input_key}>
                            <p><label className="form-label">{response.label} <span className="required">{response.required ? '(*)' : ''}</span></label></p>
                            <p className="form-input">{displayInput(response)}</p>
                        </div>
                    ))}
                    <button type='submit' className="form-btn"> Submit</button>
                </form>)}
        </TemplatePage>
    );
}

export default HomePage;
