export default function BooleanQuestion({ name, trueLabel, trueValue, falseLabel, falseValue, ...props }) {
    return (
        <div className="boolean-choice-group">
            <label className="boolean-option">
                <input
                    {...props}
                    type="radio"
                    name={name}
                    value={trueValue}
                    className="boolean-input"
                />
                {trueLabel}
            </label>
            <label className="boolean-option">
                <input
                    {...props}
                    type="radio"
                    name={name}
                    value={falseValue}
                    className="boolean-input"
                />
                {falseLabel}
            </label>
        </div>
    );
}
