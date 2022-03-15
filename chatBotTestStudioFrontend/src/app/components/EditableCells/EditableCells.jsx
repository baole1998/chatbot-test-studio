import { useState } from 'react';

const EditableCells = ({ value, setValue }) => {
    const [editingValue, setEditingValue] = useState(value);
    const [focus, setFocus] = useState("inline-edit")

    const onChange = (event) => setEditingValue(event.target.value);

    const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();
            setFocus("inline-edit")
        }
    }

    const onBlur = (event) => {
        if (event.target.value.trim() === "") {
            setEditingValue(value);
        } else {
            setValue(event.target.value)
            setFocus("inline-edit")
        }
    }

    return (
        <input
            className={focus}
            type="text"
            aria-label="Field name"
            value={editingValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onFocus={() => setFocus("form-control")}
        />
    );
};

export default EditableCells