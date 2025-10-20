### configuração  
git init                             » inicializa um repositório vazio  
git config --list                    » mostra as informações da configuração  
git config --global user.name NOME   » cria um nome para identificar quem está usando o git  
git config --global user.email EMAIL » cria um email para identificar quem está usando o git  
git remote add origin URL            » adiciona um repositório remoto  
git clone URL                        » copia um repositório online "github" para a máquina local  
git add [ARQUIVO][.]                 » acrescenta ARQUIVO ou todos os arquivo "." no repositório  
git log                              » mostra o histórico de commits  
git show                             » mostra a última alteração do repositório  
git status                           » mostra a branch atual e se há alguma alteração esperando commit  
git branch                           » lista todas as branch criadas  
git branch NOME                      » cria lista todas as branch criadas  
git branch -D NOME                   » lista todas as branch criadas  
git commit [MENSAGEM]                » cria uma mensagem que identificará um ponto histórico  
git merge BRANCH                     » acrescenta BRANCH ao branch atual  
git pull                             » carrega as alterações que estão no git na máquina local  
git push origin main                 » efetiva o envio dos arquivos alterados e o commit para o controle git  