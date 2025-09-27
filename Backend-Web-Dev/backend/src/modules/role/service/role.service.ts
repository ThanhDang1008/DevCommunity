import Role, { IRole } from "../schemes/role.model";

class RoleService {
  public async createRole(data: any): Promise<IRole | any> {
    try {
      const role = await Role.create({
        role: data.role,
        description: data.description || "",
        permission: data.permission || [],
      });
      return role;
    } catch (error) {
      throw error;
    }
  }

  public async getRoleById(id: string): Promise<IRole | any> {
    try {
      const role = await Role.findOne({ _id: id });
      // console.log("role: ", role);
      return role;
    } catch (error) {
      throw error;
    }
  }

  public async getRoleByName(name: string): Promise<IRole | null> {
    try {
      const role = await Role.findOne({ role: name });
      if (!role) return null;
      return role;
    } catch (error) {
      throw error;
    }
  }

  public async getAll(): Promise<IRole[] | any> {
    try {
      const role = await Role.find();
      if (!role || role.length === 0) return null
      return role;
    } catch (error) {
      throw error;
    }
  }
}

export const roleService: RoleService = new RoleService();
