package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.model.enums.StatusChamado;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void enviarNotificacaoChamadoAberto(String emailSindico, String tituloChamado, String nomeMorador) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(emailSindico);
            helper.setSubject("Novo Chamado Aberto: " + tituloChamado);
            helper.setText(
                "<h3>Novo Chamado Aberto</h3>" +
                "<p>O morador <b>" + nomeMorador + "</b> abriu um novo chamado: <i>" + tituloChamado + "</i>.</p>" +
                "<p>Acesse o painel do ZelaTech para analisar os detalhes.</p>",
                true
            );
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Erro ao enviar email para o síndico: " + e.getMessage());
        }
    }

    public void enviarNotificacaoStatusAtualizado(String emailMorador, String tituloChamado, StatusChamado novoStatus) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(emailMorador);
            helper.setSubject("Atualização no seu chamado: " + tituloChamado);
            helper.setText(
                "<h3>Atualização de Status</h3>" +
                "<p>O status do seu chamado <i>" + tituloChamado + "</i> foi atualizado para: <b>" + novoStatus.name() + "</b>.</p>" +
                "<p>Verifique o painel do ZelaTech para mais informações.</p>",
                true
            );
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Erro ao enviar email para o morador: " + e.getMessage());
        }
    }
}
