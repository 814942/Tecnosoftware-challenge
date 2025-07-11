import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await apiService.post('/users', createUserRequest);
  }

  async findAll(userQuery: UserQuery): Promise<User[]> {
    return (
      await apiService.get<User[]>('/users', {
        params: userQuery,
      })
    ).data;
  }

  async findOne(id: string): Promise<User> {
    return (await apiService.get<User>(`/users/${id}`)).data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<void> {
    const {
      firstName,
      isActive,
      lastName,
      password,
      role,
      username,
    } = updateUserRequest;
    await apiService.put(`/users/${id}`, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
      role: role || undefined,
      isActive,
      password: password || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/users/${id}`);
  }
}

export default new UserService();
