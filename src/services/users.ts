// User Management API Service
const BASE_URL = 'https://kmrl-backend-qjvw.onrender.com/api/v1/accounts';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  has_fitness_authority?: boolean;
  can_approve_maintenance?: boolean;
  priority_level?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  role_type: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'TECHNICIAN' | 'VIEWER';
  description?: string;
  department?: string;
  can_create_induction_plans?: boolean;
  can_approve_induction_plans?: boolean;
  can_override_decisions?: boolean;
  can_manage_maintenance?: boolean;
  can_issue_certificates?: boolean;
  can_manage_branding?: boolean;
  can_view_all_data?: boolean;
  can_export_data?: boolean;
  can_manage_users?: boolean;
  can_configure_system?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number?: string;
  alternate_phone?: string;
  joining_date?: string;
  designation?: string;
  grade?: string;
  shift_type?: 'DAY' | 'NIGHT' | 'ROTATING';
  department?: Department;
  role?: Role;
  is_active: boolean;
  last_login?: string;
  receive_email_notifications?: boolean;
  receive_sms_notifications?: boolean;
  receive_whatsapp_notifications?: boolean;
  notification_categories?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user: string;
  activity_type: string;
  description: string;
  affected_object_type?: string;
  affected_object_id?: string;
  ip_address?: string;
  user_agent?: string;
  additional_data?: Record<string, any>;
  created_at: string;
}

export interface UserSession {
  id: string;
  user: string;
  session_key: string;
  login_time: string;
  logout_time?: string;
  is_active: boolean;
  ip_address?: string;
  user_agent?: string;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  employee_id: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number?: string;
  alternate_phone?: string;
  joining_date?: string;
  designation?: string;
  grade?: string;
  shift_type?: 'DAY' | 'NIGHT' | 'ROTATING';
  department?: string;
  receive_email_notifications?: boolean;
  receive_sms_notifications?: boolean;
  receive_whatsapp_notifications?: boolean;
  notification_categories?: string[];
}

export interface AssignRoleRequest {
  role_id: string;
  valid_until?: string;
  assignment_reason?: string;
}

export interface LockAccountRequest {
  duration_minutes?: number;
  reason?: string;
}

class UserService {
  private getAuthHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Department Endpoints
  async getDepartments(token: string, params?: Record<string, any>): Promise<{ results: Department[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/departments/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: Department[], count: number }>(response);
  }

  async createDepartment(token: string, departmentData: Partial<Department>): Promise<Department> {
    const response = await fetch(`${BASE_URL}/departments/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(departmentData),
    });

    return this.handleResponse<Department>(response);
  }

  async updateDepartment(token: string, id: string, departmentData: Partial<Department>): Promise<Department> {
    const response = await fetch(`${BASE_URL}/departments/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(departmentData),
    });

    return this.handleResponse<Department>(response);
  }

  async deleteDepartment(token: string, id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/departments/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
  }

  // Role Endpoints
  async getRoles(token: string, params?: Record<string, any>): Promise<{ results: Role[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/roles/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: Role[], count: number }>(response);
  }

  async createRole(token: string, roleData: Partial<Role>): Promise<Role> {
    const response = await fetch(`${BASE_URL}/roles/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(roleData),
    });

    return this.handleResponse<Role>(response);
  }

  async updateRole(token: string, id: string, roleData: Partial<Role>): Promise<Role> {
    const response = await fetch(`${BASE_URL}/roles/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(roleData),
    });

    return this.handleResponse<Role>(response);
  }

  async deleteRole(token: string, id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/roles/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
  }

  // User Endpoints
  async getUsers(token: string, params?: Record<string, any>): Promise<{ results: User[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/users/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: User[], count: number }>(response);
  }

  async getUser(token: string, id: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<User>(response);
  }

  async createUser(token: string, userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  async updateUser(token: string, id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  async deleteUser(token: string, id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
    }
  }

  async assignRole(token: string, userId: string, roleData: AssignRoleRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}/assign_role/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(roleData),
    });

    return this.handleResponse<User>(response);
  }

  async revokeRole(token: string, userId: string, roleId: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}/revoke_role/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ role_id: roleId }),
    });

    return this.handleResponse<User>(response);
  }

  async resetUserPassword(token: string, userId: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/users/${userId}/reset_password/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<any>(response);
  }

  async lockAccount(token: string, userId: string, lockData: LockAccountRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}/lock_account/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(lockData),
    });

    return this.handleResponse<User>(response);
  }

  async unlockAccount(token: string, userId: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}/unlock_account/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<User>(response);
  }

  // Activity Endpoints
  async getUserActivities(token: string, params?: Record<string, any>): Promise<{ results: UserActivity[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/activities/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: UserActivity[], count: number }>(response);
  }

  // Session Endpoints
  async getUserSessions(token: string, params?: Record<string, any>): Promise<{ results: UserSession[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/sessions/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: UserSession[], count: number }>(response);
  }
}

export const userService = new UserService();
export default userService;