declare namespace School.Users {
  interface User {
    lastName: string
    firstName: string
    email: string
  }

  interface Student extends User {
    graduation: number
    mainTeacher: Teacher
  }

  interface Teacher extends User {
    classes: Student[][]
    room: School.Building.Room
  }
}

declare namespace School.Building {
  interface Room {
    name: string
  }
}
