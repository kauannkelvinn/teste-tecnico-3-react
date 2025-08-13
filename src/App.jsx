import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import * as yup from 'yup';
import './App.css';

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  telefone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(/\(\d{2}\) \d{5}-\d{4}/, "Telefone inválido"),
  senha: yup.string().min(6, "Senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('senha'), null], "As senhas precisam ser iguais")
    .required("Confirmação de senha é obrigatória")
});

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      setSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      });
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(e => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Cadastro de Usuário</h2>
      {success && <p style={{ color: 'green' }}>Cadastro realizado com sucesso!</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Nome:</label><br />
          <input name="nome" value={formData.nome} onChange={handleChange} />
          {errors.nome && <p style={{ color: 'red' }}>{errors.nome}</p>}
        </div>

        <div>
          <label>Email:</label><br />
          <input name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label>Telefone:</label><br />
          <IMaskInput
           mask="(00) 00000-0000"
           name="telefone"
           value={formData.telefone}
           onAccept={(value) => setFormData({ ...formData, telefone: value })}
          />
          {errors.telefone && <p style={{ color: 'red' }}>{errors.telefone}</p>}
        </div>

        <div>
          <label>Senha:</label><br />
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} />
          {errors.senha && <p style={{ color: 'red' }}>{errors.senha}</p>}
        </div>

        <div>
          <label>Confirmar senha:</label><br />
          <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />
          {errors.confirmarSenha && <p style={{ color: 'red' }}>{errors.confirmarSenha}</p>}
        </div>

        <button type="submit" style={{ marginTop: 10 }}>Cadastrar</button>
      </form>
    </div>
  );
}

export default App;
