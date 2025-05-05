const handleError=(error)=>{
    console.log(error.message, error.code);
    let errors = { name: "", email: "", password: "" };

    
    if (error.code === "incorrect email") {
        errors.email = "that email is already registered";
        return errors;
    }
    if (error.message === "incorrect password") {
        errors.password = "that password is incorrect";
        return errors;
        
    }
    if (error.message.includes("user validation failed")) {
        Object.values(error.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    if (error.code === "use another email") {
        errors.email = "that email is already registered";
        return errors;
    }   

}
export default handleError;