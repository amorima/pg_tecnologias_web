# Projeto de Grupo
<b>Curso:</b> Licenciatura em Tecnologias e Sistemas de Informação para a Web <br>
<b>Unidade Curricular:</b> Tecnologias Web <br>
<b>Tema:</b> Sistema de Gestão de Ensino Superior <br>
<b>Grupo nº.:</b> 3 <br><br>
<b>Elementos:</b> <br>
<b>Antonio Amorim</b> - 40240119<br>
<b>Gabriel Paiva</b>  - 40240137<br>
<b>Henrique Reis</b>  - 40240132<br>

## Funcionalidades Principais

1. **Login Separado**  
   - **Admin**: Em `admin_login.html` com credenciais fixas `ADMIN / ADMIN`.  
   - **Estudante / Professor**: Em `index.html`.  
   - O professor precisa ser aprovado pelo admin antes de aceder ao dashboard.

2. **Admin**  
   - Página: `admin_dashboard.html`.  
   - Pode **aprovar** professores (inicialmente `approved = false`).  
   - Pode **gerir** (adicionar/remover) **cursos** e **disciplinas** no `localStorage`.

3. **Professor**  
   - Páginas: 
     - `teachers_dashboard.html`: Visão geral e atalhos.  
     - `teachers_students.html`: Lista de alunos, atribuição e remoção de notas.  
     - `teachers_schedule.html`: Adicionar/remover horários (curso, dia, hora, disciplina).  
     - `teachers_statistics.html`: Exibe estatísticas da disciplina (média de notas e número de alunos avaliados).  
     - `teachers_profile.html`: Alterar avatar e “Informações e Contactos” (campo livre).

4. **Estudante**  
   - Páginas:  
     - `students_dashboard.html`: Resumo e atalhos para Notas, Horário e Perfil.  
     - `students_profile.html`: Alterar avatar e “Informações do Aluno” (campo livre `infoExtra`).  
     - `students_grades.html`: Visualizar notas lançadas pelos professores.  
     - `students_schedule.html`: Ver horários — filtrados pelo curso do estudante.

5. **Notificações**  
   - Ao lançar uma nota, o aluno recebe uma notificação (exibida no sino na navbar).  
   - O sino mostra um *badge* com a quantidade de notificações por ler.  
   - Ao clicar na notificação, marca como lida e recarrega a página.

6. **Responsividade**    
   - **Offcanvas** em ecrãs pequenos (sidebar oculta) e **sidebar fixa** em ecrãs grandes.  
   - Uso de **Bootstrap** para layout, forms, botões, modais, etc.

7. **LocalStorage**  
   - Todos os dados (admin, estudantes, professores, cursos, disciplinas, notas, horários) ficam em `localStorage`.  
   - `script.js` contém a lógica de CRUD e inicializa valores padrão (admin, cursos, disciplinas) se não existirem.

## Personalização

- Para alterar **cursos** ou **disciplinas** padrão, edite a função `initializeDefaults()` em `script.js`.  
- Para redefinir o administrador, modifique o objeto guardado em `ADMIN_KEY`.  
- Se desejar **limpar** todos os dados, pode executar `localStorage.clear()` na consola do browser.
