import React, { useState } from "react";
import TemplatePage from "../templatePage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import '../questionairePage.css'
import TextAreaInput from "../inputs/TextAreaInput";
import TextInput from "../inputs/textInput";
import RadioGroup from "../inputs/radioGroup";
import CheckboxGroup from "../inputs/checkboxGroup";
import BooleanQuestion from "../inputs/booleanQuestion";
import DateTimeInput from "../inputs/dateTimeInput";
import DropdownInput from "../inputs/dropdownInput";

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
    const [formData, setFormData] = useState({});
    const { data, isLoading, isError } = useQuery({
        queryKey: ['questionnaire', id],
        queryFn: () => fetchQuestionaire(id),
    });

    function OnChange(e, response) {
        const { name, value, type, files, } = e.target

        setFormData((prev) => ({
            ...prev,

            [name]: {
                input_key: name,
                value: type === 'file' ? files[0] : value,
                options: response.options || []
            }
        }))
    }
    function displayInput(response, formData, OnChange) {
        const inputValue = formData?.[response.input_key]?.value || '';

        const inputProps = {
            name: response.input_key,
            required: response.required,
            value: inputValue,
            onChange: (e) => OnChange(e, response)
        };

        switch (response.type) {
            case 'FREE_TEXT':
                return <TextAreaInput {...inputProps} />;
            case 'SIMPLE_TEXT':
                return <TextInput {...inputProps} />;
            case 'DATE_TIME':
                return <DateTimeInput {...inputProps} />;
            case 'FILE_UPLOAD':
            case 'DOC_UPLOAD':
                return <FileInput name={response.input_key} />;

            case 'RATING':
                return <RadioGroup {...inputProps} options={response.options || []} />;
            case 'RADIOS':
                return <RadioGroup {...inputProps} options={response.options || []} />;
            case 'DROPDOWN':
                return <DropdownInput {...inputProps} options={response.options || []} />
            case 'MULTIPLE_CHOICE':
                return <RadioGroup {...inputProps} options={response.options || []} />;
            case 'CHECKBOXES':
                return <CheckboxGroup {...inputProps} options={response.options || []} />;
            case 'BOOLEAN_QUESTION':
                return<BooleanQuestion {...inputProps} options={response.options || []}/>
            default:
                return <TextAreaInput {...inputProps} />;
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            questionnaireId: id,
            responses: Object.values(formData)
        };

        try {
            const res = await fetch('http://localhost:5000/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            alert('Your response was submitted successfully!')
            console.log('Submission successful:', data);
        } catch (error) {
            alert('Sorry, there was an error submitting.')
            console.error('Error submitting:', error);
        }
    }

    return (
        <TemplatePage>
            <header>Questionaire form</header>
            <p className="description">This is the questionnaire page number {id}.</p>

            {isLoading && <p>Questionnaire Loading...</p>}

            {!data && <p>No Questions here!</p>}

            {isError && <p>Oops! Error loading this questionnaire.</p>}

            {data && (
                <form methods='POST' className="form-body" onSubmit={handleSubmit}>

                    {data.map((response) => (
                        <div key={response.input_key} className="form-group">

                            <p><label className="form-label">{response.label} <span className="required">{response.required ? '(*)' : ''}</span></label></p>
                            <div className="form-input">{displayInput(response)}</div>
                        </div>
                    ))}
                    <button type='submit' className="form-btn"> Submit</button>



                </form>)}
        </TemplatePage>
    );
}

export default HomePage;
