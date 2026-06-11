import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import { Building2, Mail, Lock, User, Home, Loader2, AlertCircle, Sun, Moon, UploadCloud, FileText } from 'lucide-react';

export default function Cadastro() {
  const [perfil, setPerfil] = useState('MORADOR'); // 'MORADOR' ou 'SINDICO'
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    apartamento: ''
  });
  const [arquivos, setArquivos] = useState({
    ataEleicao: null,
    documentoIdentidade: null
  });
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setArquivos(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!lgpdAceite) {
      setError('Você deve aceitar os Termos e Condições (LGPD) para prosseguir.');
      return;
    }
    
    if (perfil === 'SINDICO' && (!arquivos.ataEleicao || !arquivos.documentoIdentidade)) {
      setError('Para o cadastro de Síndico, é obrigatório anexar a Ata de Eleição e um Documento de Identidade.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (perfil === 'MORADOR') {
        await authService.registerMorador(formData);
        setSuccessMsg('Cadastro realizado com sucesso! Redirecionando...');
      } else {
        const formDataPayload = new FormData();
        formDataPayload.append('nome', formData.nome);
        formDataPayload.append('email', formData.email);
        formDataPayload.append('senha', formData.senha);
        formDataPayload.append('apartamento', formData.apartamento);
        formDataPayload.append('ataEleicao', arquivos.ataEleicao);
        formDataPayload.append('documentoIdentidade', arquivos.documentoIdentidade);
        
        await authService.registerSindico(formDataPayload);
        setSuccessMsg('Solicitação enviada com sucesso! Aguarde aprovação do administrador.');
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        title="Alternar Tema"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl border border-border p-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="flex justify-center text-primary mb-4">
            <div className="p-3 bg-secondary rounded-2xl border border-border">
              <Building2 size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            <span className="text-primary">Zela</span>Tech
          </h1>
          <p className="text-muted-foreground">Crie sua conta no sistema</p>
        </div>

        {/* Perfil Toggle */}
        <div className="flex bg-secondary rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setPerfil('MORADOR')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              perfil === 'MORADOR' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sou Morador
          </button>
          <button
            type="button"
            onClick={() => setPerfil('SINDICO')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              perfil === 'SINDICO' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sou Síndico
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6 text-sm text-center font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <User size={18} />
              </div>
              <input 
                type="text" 
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ex: João da Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Apartamento / Bloco</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Home size={18} />
              </div>
              <input 
                type="text" 
                name="apartamento"
                required
                value={formData.apartamento}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder={perfil === 'MORADOR' ? "Ex: Apt 101 Bloco A" : "Ex: Administração"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="senha"
                required
                value={formData.senha}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {perfil === 'SINDICO' && (
            <div className="space-y-4 p-4 border border-dashed border-primary/50 rounded-lg bg-primary/5">
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                <FileText size={18} /> Documentos Comprobatórios
              </h3>
              <p className="text-xs text-muted-foreground">
                Para solicitar acesso de Síndico, precisamos validar sua Ata de Eleição e Documento de Identidade (PDF ou Imagem).
              </p>
              
              <div>
                <label className="block text-xs font-medium text-card-foreground mb-1">Ata de Eleição</label>
                <input 
                  type="file" 
                  name="ataEleicao"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-card-foreground mb-1">RG ou CNH</label>
                <input 
                  type="file" 
                  name="documentoIdentidade"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          )}

          {/* LGPD Consentimento */}
          <div className="flex items-start gap-2 pt-2">
            <input 
              type="checkbox" 
              id="lgpd" 
              checked={lgpdAceite}
              onChange={(e) => setLgpdAceite(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary bg-background"
            />
            <label htmlFor="lgpd" className="text-xs text-muted-foreground leading-tight cursor-pointer">
              Declaro que li e concordo com a Política de Privacidade. Autorizo o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) para fins de gestão condominial.
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : perfil === 'MORADOR' ? (
              'Cadastrar no Sistema'
            ) : (
              <>
                <UploadCloud size={20} /> Enviar Solicitação
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}