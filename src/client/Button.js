var React = require('react');

var Button = ({
    onClick,
    className,
    children
}) => (<div onClick={onClick} className={"button " + className}>{children}</div>);


module.exports = Button;