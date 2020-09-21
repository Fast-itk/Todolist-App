import React from 'react'
import classes from './Auth.module.scss'
import AuthInput from '../../components/UI/AuthInput/AuthInput'
import is from 'is_js'
import axios from 'axios'

class Auth extends React.Component {

    state = {
        isFormValid: false,
        authStatus: {
            loginSuccess: false,
            registerSuccess: false,
        },
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                placeholder: 'Введите вашу почту',
                errorMessage: 'Введите корректный email',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                placeholder: 'Введите ваш пароль',
                errorMessage: 'Введите корректный пароль',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    }

    loginHandler = async () => {
        const authData = {
            email: this.state.formControls.email.value,
            password: this.state.formControls.password.value,
            returnSecureToken: true
        }

        try {
            const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDE-mYhMw722dLY7ex6_MmZJeA5D810El0', authData)

            const authStatus = {...this.state.authStatus}

            authStatus.loginSuccess = !this.state.authStatus.loginSuccess
            setTimeout(() => {
                authStatus.loginSuccess = !this.state.authStatus.loginSuccess
                this.setState({
                    authStatus
                })
            }, 3000)

            this.setState({
                authStatus
            })

            console.log(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    registerHandler = async () => {
        const authData = {
            email: this.state.formControls.email.value,
            password: this.state.formControls.password.value,
            returnSecureToken: true
        }

        // const DefaultTask = {

        // }

        // // try {
        // //     await axios.post('https://todolist-app-fb466.firebaseio.com/task.json', task) 
        // // } catch(e) {
        // //     console.error(e)
        // // }

        try {
            const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDE-mYhMw722dLY7ex6_MmZJeA5D810El0', authData)

            const authStatus = {...this.state.authStatus}

            authStatus.registerSuccess = !this.state.authStatus.registerSuccess
            setTimeout(() => {
                authStatus.registerSuccess = !this.state.authStatus.registerSuccess
                this.setState({
                    authStatus
                })
            }, 3000)

            this.setState({
                authStatus
            })

            console.log(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    submitHandler = event => {
        event.preventDefault()
    }

    validateControl(value, validation) {
        if (!validation) {
            return true
        }

        let isValid = true

        if (validation.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) {
            isValid = is.email(value) && isValid
        }

        if (validation.minLength) {
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    onChangeHandler = (event, controlName) => {
        const formControls = { ...this.state.formControls }
        const control = { ...formControls[controlName] }

        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation)

        formControls[controlName] = control
        let isFormValid = true

        Object.keys(formControls).forEach(name =>{
            isFormValid = formControls[name].valid && isFormValid
        })


        this.setState({
            formControls,
            isFormValid
        })

    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
            return(
                <AuthInput 
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    placeholder={control.placeholder}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )
        })
    }

    render() {

        return (
            <div className={classes.Auth}>
                
                <div>
                    <h1>Авторизация</h1>
                    <form onSubmit={this.submitHandler}>

                        { this.renderInputs() }

                        <div className={classes.wrapper}>
                            

                            {
                                this.state.isFormValid
                                ? <button 
                                    onClick={this.loginHandler} 
                                    className={classes.buttonGreen}
                                    >Войти</button>
                                : <button className={classes.disabled}>Войти</button>
                            }

                            {
                                this.state.isFormValid
                                ?  <button 
                                    onClick={this.registerHandler} 
                                    className={classes.buttonPri}
                                >Регистрация</button>
                                : <button className={classes.disabled}>Регистрация</button>
                            }
                        
                        </div>

                        {
                            this.state.authStatus.registerSuccess
                            ? <span className={classes.success}>Вы успешно зарегистрировались</span>
                            : null
                        }

                        {
                            this.state.authStatus.loginSuccess
                            ? <span className={classes.success}>Вы успешно авторизировались</span>
                            : null
                        }
                        
                        

                    </form>
                </div>
                

            </div>
        )
    }
}

export default Auth
