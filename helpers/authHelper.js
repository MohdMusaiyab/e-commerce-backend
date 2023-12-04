import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    //no of times to rehash it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    
    return error;  }
};
export const comparePassword=async(password,hashedPassword)=>{
    try{    
          return bcrypt.compare(password,hashedPassword);
    }catch(error)
    {
        return false;
    }
}