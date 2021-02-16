- [Bulletin documentation (OBS! Written in Swedish)](#bulletin-documentation-obs-written-in-swedish)
  - [User and Post schema](#user-and-post-schema)
      - [User schema](#user-schema)
      - [Post schema](#post-schema)
  - [Validate Cookie functionen och SessionId](#validate-cookie-functionen-och-sessionid)
    - [sessionId](#sessionid)

# Bulletin documentation (OBS! Written in Swedish)
Detta är dokumentationen av mini projektent som vi har gjort i wesweb 01.
Denna dokumentation är skriven på svenska för att underlätta en del saker.

---
## User and Post schema
Det finns två stycken schemas en/ett för användare och en/ett för inlägg (posts)


####  User schema
Användar schemat ser ut pǻ följande sätt

```javascript
const userSchema = new moon.Schema({
    username: String,
    password: String,
    firstName: String,
    surName: String,
    email: String,
    age: Number,
    sessionId: String,
})
```
varje användare har
- ett användarnamn
- ett lösenord
- ett för- och efternamn
- en email (för att kunna kontakta användaren)
- ålder
- och sessionId (se [sessionId](#sessionid))

Det mesta här förklara sig själv. så som username, password, email.
Men sen finns det också sessionId. det förklara jag lite senare

#### Post schema
```javascript
const postSchema = new moon.Schema({
    author: String,
    authorId: String,
    title: String,
    post: String,
    date: Date,
    tag: String,
})
```
Post schemat innehåller
- vem som har gjort inlägget och personens id
- en titel
- datum när det las upp / uppdaterades senast
- och en tag för sortering

(authorId är det id som mongodb autogenererar när en ny användare skapas)

---

## Validate Cookie funktionen och SessionId
Funktionen som håller koll på alla sessioner och checkar om en användare är inloggad kallas
`validateCookie`

och ser ut på följande sätt

```javascript
function validateCookie(req, res, next) {
    const { cookies } = req

    if ('sessionId' in cookies && 'userId' in cookies) {
        User.findById(cookies.userId, (err, user) => {
            if (user) {
                if (cookies.sessionId == user.sessionId) {
                    next()
                }
                else {
                    res.status(403).redirect("/index/signIn")
                }
            }
            else {
                res.status(403).redirect("/index/signIn")
            }
        })
    }
    else {
        res.status(403).redirect("/index/signIn")
    }
}
```

Den börjar med att hämta alla kakor (cookies) från den request man gör till servern/sidan. Sedan så checkar `validateCookie` om kakorna `sessionId` och `userId` finns och om de stämmer med den data som finns i databasen. Om den inte stämmer eller om kakorna inte finns så blir användaren skickad vidare til `/index/signIn` där man blir tvingad att logga in eller skapa ett konto. 

### sessionId
För att förklara `sessionId` så ä det en `string` som skapas vid varje inloggning, den sparas på databasen och kollas på varje del av sidan jämnt emot de som databasen har sparat. `sessionId` finns för att en användare inte ska behöva autentisera sig så fort man ska göra något så som
- att göra ett inlägg
- ändra i konto inställningarna
- kolla in en annan profil
- m.m
---



---

# Disclaimer
Det finns delar av koden som man kan skriva på olika sätt, dels för att optimera men också för att göra den enklare att läsa. men nu har jag valt att göra på detta sätt, men känn dig välkommen att förbättra och förändra koden.