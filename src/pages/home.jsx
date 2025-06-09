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
    function displayInput(response) {
        const inputProps = {
            name: response.input_key,
            required: response.required,
            value: formData[response.input_key]?.value || '',
            onChange: (e) => OnChange(e, response)
        };

        if (response.options && response.options.length > 0) {
            return handleInputType(response.type.toLowerCase(), inputProps, response.options);
        }

        switch (response.type) {
            case 'FREE_TEXT':
                return handleInputType("textarea", inputProps);
            case 'SIMPLE_TEXT':
                return handleInputType("text", inputProps);
            case 'DATE_TIME':
                return handleInputType("date_time", inputProps);
            case 'FILE_UPLOAD':
            case 'DOC_UPLOAD':
                return handleInputType('upload', inputProps)
            default:
                return handleInputType("textarea", inputProps);
        }
    }

    function handleInputType(input_type, inputProps, options = []) {
        const normalizedOptions = normalizeOptions(options);

        switch (input_type) {
            case "textarea":
                return <textarea {...inputProps} placeholder="You can input multiple lines..." />;

            case "text":
                return <input {...inputProps} type="text" className="text-input" />;

            case "date_time":
                return <input {...inputProps} type="datetime-local" className="datetime-input" />;

            case 'multiple_choice':
            case "rating":
            case 'radios':
                return (
                    <div className="single-choice-group">
                        {normalizedOptions.map((option, index) => (
                            <label key={index} className="single-choice-option">
                                <input
                                    {...inputProps}
                                    type="radio"
                                    value={option.value}
                                    className="single-choice-input"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                );

            case "dropdown":
                return (
                    <select {...inputProps} className="dropdown-input">
                        <option value="">Select an option</option>
                        {normalizedOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            case 'checkboxes':
                return (
                    <div className="multiple-choice-group">
                        {normalizedOptions.map((option, index) => (
                            <label key={index} className="multiple-choice-option">
                                <input
                                    {...inputProps}
                                    type="checkbox"
                                    value={option.value}
                                    className="multiple-choice-input"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                );
            case 'upload':
                return <input {...inputProps} className='file-input' type="file" />
            case 'boolean_question':
                const trueOption = normalizedOptions[0];
                return (
                    <div className="boolean-choice-group">
                        <label className="boolean-option">
                            <input
                                {...inputProps}
                                type="radio"
                                value={trueOption.trueValue}
                                name={inputProps.name}
                                className="boolean-input"
                            />
                            {trueOption.trueLabel}
                        </label>
                        <label className="boolean-option">
                            <input
                                {...inputProps}
                                type="radio"
                                value={trueOption.falseValue}
                                name={inputProps.name}
                                className="boolean-input"
                            />
                            {trueOption.falseLabel}
                        </label>
                    </div>
                );
            default:
                return <textarea {...inputProps} placeholder="You can input multiple lines..." />;

        }


    }
    function normalizeOptions(options) {
        if (!Array.isArray(options)) return [];

        const result = [];

        for (const opt of options) {
            if (typeof opt === 'string') {
                result.push({ label: opt, value: opt });

            } else if (typeof opt === 'object' && opt !== null) {
                const keys = Object.keys(opt);

                if (
                    keys.includes("trueLabel") &&
                    keys.includes("trueValue") &&
                    keys.includes("falseLabel") &&
                    keys.includes("falseValue")
                ) {
                    result.push({
                        trueLabel: opt.trueLabel,
                        trueValue: opt.trueValue,
                        falseLabel: opt.falseLabel,
                        falseValue: opt.falseValue
                    });

                } else if ("label" in opt && "value" in opt) {
                    result.push({ label: opt.label, value: opt.value });

                } else if (keys.includes("trueLabel") && keys.includes("trueValue")) {
                    result.push({ label: opt.trueLabel, value: opt.trueValue });

                } else if (keys.includes("falseLabel") && keys.includes("falseValue")) {
                    result.push({ label: opt.falseLabel, value: opt.falseValue });

                } else {
                    for (const [key, value] of Object.entries(opt)) {
                        result.push({ label: key, value });
                    }
                }
            }
        }

        return result;
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
