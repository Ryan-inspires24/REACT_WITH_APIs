export default function DropdownInput({ options = [], ...props }) {
    return (
        <select {...props} className="dropdown-input">
            <option value="">Select an option</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>{option}</option>
            ))}
        </select>
    );
}
