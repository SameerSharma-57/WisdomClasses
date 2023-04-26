# WisdomClasses

# How to install
First clone the repository on your local device. Node js, npm and any IDE for e.g. visual studio code must be installed before hand on your local machine. Now, on the terminal, locate the folder and install dependencies using  command (npm i). Now you can host the website on your local server (local port 3030) by the command (npm run devStart). 

# Type of accounts:
# Admin account:
 login credentials: User name - 'Admin', Email-Id - 'Admin@gmail.com', Password - '123'
 Admin account will be single and cannot be registered by anyone else except the developers.
 
 You can add and delete announcements which would be visible to all the students on their dashboard. Only admin can add teacher accounts on the server using the 'create teacher account' button on navbar of Admin Dashboard. Admin can also see and analyse statistics of the institute like no of students registered, no of teachers registered and  no of quizzes hosted and can also see details about each.
 
 # Teacher Account:
 login credentials: 1.User name - 'Sameer Sharma', Email-Id - 'Sameer@gmail.com', Password - '123456'
                    2.User name - 'Shashwat', Email-Id - 'Shashwat@gmail.com', Password - '123456'
                    3.Any other account registered by the admin
                    
 Teacher will be able to post and delete announcements which would be visible to students. They can post and delete quizzes on the website. There is a provision to add and delete questions for a particular quiz which can only be done through the teacher account through which it was created. Teachers can add multiple choice questions which have the default marking scheme of +4 and -1. Quiz will be visible to students as soon as the teacher.Teacher can end the quiz whenever he/she wants to do so. After a quiz is ended, no furthur changes can be made in the quiz and it will be archived. However, Teacher can unarchive the quiz and restart the quiz which will reset the leaderboard. When students will attempt the quiz, teacher will be able to see the leaderboard which consists of students' score along with their rank and other information like no of correct answers, incorrent answers etc. 
 
 # Student Account:
 login credentials: 1. User name - 'Tarun', Email-Id - 'tarun@gmail.com', Password - '123456'
                    2. User name - 'Shalin', Email-Id - 'Shalin@gmail.com', Password - '123456'
                    3. Any other student that is registered on the website
                    
 Students will be able to register themselves on the website by using their email-id. They can see the announcements posted by teacher and admin on the website. They can attempt the quizzes posted by teachers. Once the quiz is started, it will be visible to students and they can attempt it only once. Also, if quiz is ended and archived, they will not be able to attempt it. They can see their score once they have attempted the quiz.
 
 
 NOTE - The default accounts provided, are made only for testing and do not represent any real user. One can register more accounts on the website using the functionalities provided.
