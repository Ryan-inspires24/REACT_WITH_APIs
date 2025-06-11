export default function CheckboxGroup({ options = [], name, ...props }) {
    return (
        <div className="multiple-choice-group">
            {options.map((option, index) => (
                <label key={index} className="multiple-choice-option">
                    <input
                        {...props}
                        type="checkbox"
                        value={option.value}
                        name={name}
                        className="multiple-choice-input"
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
}
