import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import COLORS from '../../../constants/colors';

interface StyledButtonProps extends TouchableOpacityProps {

}

const StyledButton: React.FC<StyledButtonProps> = ({
    style,
    children,
    ...props
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            {...props}
        >
            {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});

export default StyledButton;

