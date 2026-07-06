import React from "react";

export const FormRow = ({ children, columns = 2}) => {

    const gridCols = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-4 w-full`}>
            {children}
        </div>
    )
}