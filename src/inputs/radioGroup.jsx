export default function RadioGroup({ name, label, options = [], ...props }) {
    return (
        <div className="single-choice-group">
            {options.map((option, index) => (
                <label key={index} className="single-choice-option">
                    <input
                        {...props}
                        type="radio"
                        // value={option.value}
                        className="single-choice-input"
                    />
                    {option}
                </label>
            ))}
        </div>
    );
}
