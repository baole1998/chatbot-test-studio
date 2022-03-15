import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import { TextField, Chip } from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Downshift from "downshift";

const useStyles = makeStyles(theme => ({
    chip: {
        margin: theme.spacing(0.5, 0.25),
        maxWidth: 175,
    }
}));

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

export default function TagsInput({ ...props }) {
    const classes = useStyles();
    const { selectedTags, placeholder, tags, fieldName, oldQuestions, defaultHelperText, ...other } = props;
    const [inputValue, setInputValue] = useState("");
    const [selectedItem, setSelectedItem] = useState([]);
    const [error, setError] = useState(false)

    useEffect(() => {
        selectedTags(selectedItem);
    }, [selectedItem, selectedTags]);

    useEffect(() => {
        if (oldQuestions) {
            setSelectedItem(oldQuestions)  
        }
        // eslint-disable-next-line
    }, [])

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            const newSelectedItem = [...selectedItem];
            const duplicatedValues = newSelectedItem.indexOf(
                event.target.value.trim()
            );

            if (duplicatedValues !== -1) {
                setInputValue("");
                setError(true)
                return;
            } 

            if (!event.target.value.replace(/\s/g, "").length) return;

            newSelectedItem.push(event.target.value.trim());
            setSelectedItem(newSelectedItem);
            if (error) {
                setError(false)
            }
            setInputValue("");
        }
        if (
            selectedItem.length &&
            !inputValue.length &&
            event.key === "Backspace"
        ) {
            setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
        }
    }
    function handleChange(item) {
        let newSelectedItem = [...selectedItem];
        if (newSelectedItem.indexOf(item) === -1) {
            newSelectedItem = [...newSelectedItem, item];
        }
        setInputValue("");
        setSelectedItem(newSelectedItem);
    }

    const handleDelete = item => () => {
        const newSelectedItem = [...selectedItem];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
        setSelectedItem(newSelectedItem);
        setError(false)
    };

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    return (
        <React.Fragment>
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={handleChange}
                selectedItem={selectedItem}
            >
                {({ getInputProps }) => {
                    const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                        onKeyDown: handleKeyDown,
                        placeholder
                    });
                    return (
                        <div>
                            <TextField
                                id={error || error ? "outlined-error" : "tags"}
                                error={error}
                                helperText={error ? `This ${fieldName} already exists` : defaultHelperText}
                                InputProps={{
                                    startAdornment: selectedItem.map(item => (
                                        <CustomWidthTooltip
                                            title={item}
                                            key={item}
                                        >
                                            <Chip
                                                key={item}
                                                tabIndex={-1}
                                                label={item}
                                                className={classes.chip}
                                                onDelete={handleDelete(item)}
                                            />
                                        </CustomWidthTooltip>

                                    )),
                                    onBlur: () => {
                                        setError(false);
                                    },
                                    onChange: event => {
                                        handleInputChange(event);
                                        onChange(event);
                                    },
                                    onFocus
                                }}
                                {...other}
                                {...inputProps}
                            />
                        </div>
                    );
                }}
            </Downshift>
        </React.Fragment>
    );
}
// TagsInput.defaultProps = {
//     tags: []
// };
TagsInput.propTypes = {
    selectedTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
};
