import { avatar_default } from "@/constants/common";
import User, { IUser } from "../schemes/user.model";
import type {
  CreateUser,
  UpdateUser,
  SetInfoUser,
} from "../interfaces/user.interface";
import type { IRole } from "@/modules/role/schemes/role.model";

type UserWithRole = IUser & { id_role: IRole };
type GetAllUsersFilters = {
  sort?: {
    createdAt?: "asc" | "desc";
    updatedAt?: "asc" | "desc";
  };
};

class UserService {
  public async createUser(data: CreateUser): Promise<IUser | any> {
    try {
      const user = await User.create({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        status: data.status,
        id_role: data.id_role,
        type: data.type || "EMAIL",
        avatar: data.avatar || avatar_default,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(
    id: string,
    data: Partial<UpdateUser>
  ): Promise<IUser | null | any> {
    const updateQuery: Record<string, any> = {};

    // kiểm tra xem có trường nào trong data không null thì thêm vào updateQuery
    if (data?.fullname) updateQuery["fullname"] = data.fullname;
    if (data?.status) updateQuery["status"] = data.status;
    if (data?.id_role) updateQuery["id_role"] = data.id_role;
    if (data?.type) updateQuery["type"] = data.type;
    if (data?.avatar) updateQuery["avatar"] = data.avatar;
    if (data?.bio) updateQuery["bio"] = data.bio;
    if (data?.phone) updateQuery["phone"] = data.phone;
    if (data?.gender) updateQuery["gender"] = data.gender;
    if (data?.birthday) updateQuery["birthday"] = data.birthday;
    if (data?.location) updateQuery["location"] = data.location;

    try {
      // cập nhật thông tin user bằng id
      const user = await User.findByIdAndUpdate(
        id,
        {
          ...updateQuery,
        },
        { new: true }
      );
      // nếu không tồn tại id trả về null
      if (!user) return null;
      // nếu tồn tại id trả về user
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async setInfo(id_user: string, data: SetInfoUser) {
    const updateQuery: Record<string, any> = {};

    // kiểm tra xem có trường nào trong data không null thì thêm vào updateQuery
    if (data?.fullname) updateQuery["fullname"] = data.fullname;
    if (data?.email) updateQuery["email"] = data.email;
    if (data?.password) updateQuery["password"] = data.password;
    if (data?.status) updateQuery["status"] = data.status;
    if (data?.id_role) updateQuery["id_role"] = data.id_role;
    if (data?.type) updateQuery["type"] = data.type;
    if (data?.avatar) updateQuery["avatar"] = data.avatar;

    try {
      // cập nhật thông tin user bằng id
      const user = await User.findByIdAndUpdate(
        id_user,
        {
          ...updateQuery,
        },
        { new: true }
      );
      // nếu không tồn tại id trả về null
      if (!user) return null;
      // nếu tồn tại id trả về user
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(
    email: string
  ): Promise<UserWithRole | null | any> {
    try {
      const user = await User.findOne({ email: email })
        .populate("id_role")
        .exec();
      // nếu không tồn tại email trả về null
      //console.log("user", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(id: string): Promise<Omit<IUser, "password"> | any> {
    try {
      const user = await User.findById(id).populate({
        path: "listFriendId",
        select: "_id fullname email avatar",
      });
      //console.log(user);
      // nếu không tồn tại id trả về null
      if (!user) return null;
      if (user) {
        const { password, ...data_without_password } = user.toObject();
        return data_without_password;
      }
    } catch (error) {
      throw error;
    }
  }

  public async updatePasswordByEmail(
    email: string,
    password: string
  ): Promise<IUser | any> {
    try {
      // cập nhật mật khẩu mới cho user bằng email
      const user = await User.findOneAndUpdate(
        { email: email },
        { password: password },
        { new: true }
      );
      if (!user) return null;
      return user;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async checkEmailExist(email: string): Promise<boolean> {
    try {
      // kiểm tra email đã tồn tại chưa
      const user = await User.findOne({ email: email }).select("email").exec();
      if (!user) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async getAuthById(id: string): Promise<{
    role: IUser["id_role"];
    status: IUser["status"];
  } | null> {
    try {
      // tìm kiếm role bằng id
      const data = await User.findById(id)
        .select("id_role status")
        .populate("id_role")
        .exec();
      if (!data) return null;
      return {
        role: data.id_role,
        status: data.status,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getPermissionById(
    id: string
  ): Promise<IUser["permissions"] | null> {
    try {
      // tìm kiếm permission bằng id
      const user = await User.findById(id).select("permissions").exec();
      if (!user) return null;
      return user?.permissions as any;
    } catch (error) {
      return null;
      //throw error;
    }
  }

  public async getAll(
    page: number,
    limit: number,
    filters?: GetAllUsersFilters
  ): Promise<IUser[] | any> {
    try {
      let queryfilters: GetAllUsersFilters = {};
      if (filters?.sort) {
        queryfilters.sort = filters.sort;
      }
      //console.log("queryfilters", queryfilters);
      // lấy tất cả người dùng với phân trang
      const users = await User.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("id_role")
        .select("-password") // loại bỏ trường password
        .sort({
          ...queryfilters.sort,
        }) // sắp xếp theo ngày tạo mới nhất
        .exec();
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAll(
    filters?: GetAllUsersFilters
  ): Promise<number | any> {
    try {
      let queryfilters: GetAllUsersFilters = {};
      if (filters?.sort) {
        queryfilters.sort = filters.sort;
      }
      //console.log("queryfilters", queryfilters);
      // đếm số lượng người dùng
      const count = await User.countDocuments({}).exec();
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getListFriends(id_user: string): Promise<any> {
    try {
      // tìm kiếm người dùng bằng id và lấy danh sách bạn bè
      const user = await User.findById(id_user)
        .populate({
          path: "listFriendId",
          select: "_id fullname email avatar",
        })
        .select("_id") // loại bỏ trường password
        .exec();
      if (!user) return null;
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getRandomUsersNotInFriendList({
    page,
    limit,
    userId,
  }: {
    page: number;
    limit: number;
    userId: string;
  }): Promise<any> {
    try {
      const user = await User.findById(userId).select("listFriendId");
      if (!user) return [];

      const excludedIds = [
        user._id.toString(),
        ...(user.listFriendId || []).map((id) => id.toString()),
      ];

      // 1. Lấy tất cả _id hợp lệ
      const allOtherIds = await User.find({
        _id: { $nin: excludedIds },
      }).select("_id");

      if (allOtherIds.length === 0) return [];

      // Hàm xáo trộn mảng
      // Nguồn: https://stackoverflow.com/a/6274381
      const shuffleArray = <T>(array: T[]): T[] => {
        const arr = [...array]; // tạo bản sao, tránh làm thay đổi mảng gốc
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); // chọn index ngẫu nhiên
          [arr[i], arr[j]] = [arr[j], arr[i]]; // đổi chỗ
        }
        return arr;
      };
      // 2. Xáo trộn ID
      const shuffledIds = shuffleArray(
        allOtherIds.map((doc) => doc._id.toString())
      );

      // 3. Cắt danh sách theo trang
      const offset = (page - 1) * limit;
      const pagedIds = shuffledIds.slice(offset, offset + limit);

      // 4. Truy vấn thông tin người dùng theo ID
      const users = await User.find({ _id: { $in: pagedIds } }).select(
        "_id fullname email avatar"
      );

      // 5. Giữ đúng thứ tự
      const idOrder = new Map(pagedIds.map((id, idx) => [id, idx]));
      users.sort(
        (a, b) =>
          idOrder.get(a._id.toString())! - idOrder.get(b._id.toString())!
      );

      return users;
    } catch (error) {
      throw error;
    }
  }

  public async updateFriendRequest(data: {
    userId: string;
    friendId: string;
    type: "add" | "remove";
  }) {
    try {
      const { userId, friendId, type } = data;

      // Cập nhật yêu cầu kết bạn
      const update =
        type === "add"
          ? { $addToSet: { friendRequestsId: friendId } }
          : { $pull: { friendRequestsId: friendId } };

      await User.findByIdAndUpdate(userId, update).exec();
    } catch (error) {
      throw error;
    }
  }

  public async addListFriend(data: {
    userId: string;
    listFriendId: string[];
  }): Promise<IUser | null> {
    //console.log("addListFriend", data);
    try {
      const user = await User.findByIdAndUpdate(
        data.userId,
        { $addToSet: { listFriendId: { $each: data.listFriendId } } },
        { new: true }
      ).exec();
      if (!user) return null;
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUserById(id: string): Promise<boolean | null> {
    try {
      // xoá người dùng bằng id
      const user = await User.findByIdAndDelete(id).exec();
      if (!user) return null;
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const userService: UserService = new UserService();
