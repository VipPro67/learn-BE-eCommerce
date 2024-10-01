import userModel from "../user.model";

const createUser = async ({
  usr_id,
  usr_name,
  usr_slug,
  usr_password,
  usr_role,
}) => {
  const user = await userModel.create({
    usr_id,
    usr_name,
    usr_slug,
    usr_password,
    usr_role,
  });
  return user;
};
export default createUser;
