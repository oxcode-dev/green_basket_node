export function generatePassword(length: number = 8) : string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export function generatePin($digits = 4) {
    let i = 0; //counter
    let pin = ''; //our default pin is blank.

    while (i < $digits) {
        //generate a random number between 0 and 9.
        pin += Math.floor(Math.random() * 10);
        i++;
    }

    return pin;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}