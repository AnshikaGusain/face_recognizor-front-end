import React,{Component} from 'react';

class Register extends Component{
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            name:''
        }
    }

    onEmailChange=(event)=>{
        this.setState({email:event.target.value});
    }
    onPasswordChange=(event)=>{
        this.setState({password:event.target.value});
    }
    onNameChange=(event)=>{
        this.setState({name:event.target.value});
    }

    onSubmitRegister=()=>{
        fetch("https://facerecog-backend.onrender.com/register",{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                email:this.state.email,
                password:this.state.password,
                name:this.state.name
            })
        }).then(res=>res.json())
        .then(user=>{
            if(user._id){
                this.props.loadUser(user);
                this.props.onRouteChange("home");
            }
            // console.log(user);
        })
        .catch((err)=>console.log("Error"));
    }

    render()
    {
        return (
            <div className='center ma'>
                <article className="br3 shadow-5 ba bw2 dark-gray b--black-20 mv4 w-100 w-50-m w-25-l mw6 center">
                    <main className="pa4 black-80">
                        <form className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" htmlFor="name">Name</label>
                                <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 text-dark" type="text" name="name"  id="name"/>
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
                                <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 text-dark" type="email" name="email-address"  id="email-address"/>
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
                                <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 text-dark" type="password" name="password"  id="password"/>
                            </div>
                            </fieldset>
                            <div className="">
                            <p onClick={this.onSubmitRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib">Register</p>
                            </div>
                            
                        </form>
                    </main>
                </article>
            </div>
        )
    }
}

export default Register;