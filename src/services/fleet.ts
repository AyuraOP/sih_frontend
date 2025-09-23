// Fleet Management API Service
const BASE_URL = 'http://localhost:8000/api/v1/fleet_management';

export interface TrainsetType {
  id: string;
  name: string;
  code: string;
  description?: string;
  car_count: number;
  specifications?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Trainset {
  id: string;
  trainset_number: string;
  trainset_type: string | TrainsetType;
  manufacturer?: string;
  manufacturing_year?: number;
  manufacturing_date?: string;
  commissioning_date?: string;
  service_status: 'IN_SERVICE' | 'STANDBY' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'TESTING';
  total_mileage: string;
  monthly_mileage: string;
  service_availability: number;
  punctuality_score: number;
  is_revenue_service_ready: boolean;
  has_active_branding: boolean;
  priority_level: number;
  next_scheduled_maintenance?: string;
  current_depot?: string;
  current_stabling_bay?: string;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  trainset: string;
  car_number: string;
  car_type: 'DM' | 'T' | 'M';
  position: number;
  manufacturer?: string;
  manufacturing_date?: string;
  serial_number?: string;
  tare_weight?: string;
  gross_weight?: string;
  passenger_capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface ComponentType {
  id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  maintenance_interval_km?: number;
  maintenance_interval_days?: number;
  critical_component: boolean;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  trainset: string;
  car?: string;
  component_type: string | ComponentType;
  component_id: string;
  serial_number?: string;
  part_number?: string;
  installation_date?: string;
  installation_mileage?: string;
  health_status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  health_score: number;
  next_inspection_due?: string;
  operating_hours?: string;
  cycles_completed?: number;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface MileageLog {
  id: string;
  trainset: string;
  date: string;
  starting_mileage: string;
  ending_mileage: string;
  distance_covered: string;
  service_hours?: string;
  route_assignments?: string[];
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetrics {
  id: string;
  trainset: string;
  date: string;
  on_time_performance: number;
  service_availability: number;
  mean_distance_between_failures?: string;
  energy_consumption_kwh?: string;
  energy_per_km?: string;
  passenger_count?: number;
  passenger_km?: string;
  unscheduled_maintenance_events?: number;
  maintenance_cost?: string;
  created_at: string;
  updated_at: string;
}

export interface FleetOverview {
  total_trainsets: number;
  in_service: number;
  standby: number;
  maintenance: number;
  out_of_service: number;
  testing: number;
  average_availability: number;
  average_punctuality: number;
  total_mileage: string;
  monthly_mileage: string;
}

export interface PerformanceSummary {
  period_start: string;
  period_end: string;
  total_trainsets: number;
  average_on_time_performance: number;
  average_service_availability: number;
  total_energy_consumption: string;
  total_passenger_count: number;
  total_maintenance_events: number;
  total_maintenance_cost: string;
}

class FleetService {
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

  // Trainset Type Endpoints
  async getTrainsetTypes(token: string): Promise<TrainsetType[]> {
    const response = await fetch(`${BASE_URL}/trainset-types/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: TrainsetType[] }>(response);
    return data.results || [];
  }

  async createTrainsetType(token: string, typeData: Partial<TrainsetType>): Promise<TrainsetType> {
    const response = await fetch(`${BASE_URL}/trainset-types/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(typeData),
    });

    return this.handleResponse<TrainsetType>(response);
  }

  // Trainset Endpoints
  async getTrainsets(token: string, params?: Record<string, any>): Promise<{ results: Trainset[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/trainsets/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: Trainset[], count: number }>(response);
  }

  async getTrainset(token: string, id: string): Promise<Trainset> {
    const response = await fetch(`${BASE_URL}/trainsets/${id}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<Trainset>(response);
  }

  async createTrainset(token: string, trainsetData: Partial<Trainset>): Promise<Trainset> {
    const response = await fetch(`${BASE_URL}/trainsets/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(trainsetData),
    });

    return this.handleResponse<Trainset>(response);
  }

  async updateTrainset(token: string, id: string, trainsetData: Partial<Trainset>): Promise<Trainset> {
    const response = await fetch(`${BASE_URL}/trainsets/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(trainsetData),
    });

    return this.handleResponse<Trainset>(response);
  }

  async updateTrainsetMileage(token: string, id: string, distance: string): Promise<Trainset> {
    const response = await fetch(`${BASE_URL}/trainsets/${id}/update_mileage/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ distance }),
    });

    return this.handleResponse<Trainset>(response);
  }

  async updateServiceStatus(token: string, id: string, status: string, reason?: string): Promise<Trainset> {
    const response = await fetch(`${BASE_URL}/trainsets/${id}/update_service_status/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ service_status: status, reason }),
    });

    return this.handleResponse<Trainset>(response);
  }

  async getFleetOverview(token: string): Promise<FleetOverview> {
    const response = await fetch(`${BASE_URL}/trainsets/fleet_overview/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<FleetOverview>(response);
  }

  async getAvailableTrainsets(token: string): Promise<Trainset[]> {
    const response = await fetch(`${BASE_URL}/trainsets/available_for_service/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: Trainset[] }>(response);
    return data.results || [];
  }

  async getMaintenanceDue(token: string, days: number = 7): Promise<Trainset[]> {
    const response = await fetch(`${BASE_URL}/trainsets/maintenance_due/?days=${days}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: Trainset[] }>(response);
    return data.results || [];
  }

  // Component Endpoints
  async getComponents(token: string, params?: Record<string, any>): Promise<{ results: Component[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/components/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: Component[], count: number }>(response);
  }

  async updateComponentHealth(token: string, id: string, healthData: {
    health_status: string;
    health_score: number;
    next_inspection_due?: string;
    inspection_notes?: string;
  }): Promise<Component> {
    const response = await fetch(`${BASE_URL}/components/${id}/update_health/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(healthData),
    });

    return this.handleResponse<Component>(response);
  }

  async getCriticalComponents(token: string): Promise<Component[]> {
    const response = await fetch(`${BASE_URL}/components/critical_components/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: Component[] }>(response);
    return data.results || [];
  }

  async getMaintenanceDueComponents(token: string): Promise<Component[]> {
    const response = await fetch(`${BASE_URL}/components/maintenance_due_components/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: Component[] }>(response);
    return data.results || [];
  }

  // Performance Metrics Endpoints
  async getPerformanceMetrics(token: string, params?: Record<string, any>): Promise<{ results: PerformanceMetrics[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/performance-metrics/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: PerformanceMetrics[], count: number }>(response);
  }

  async getFleetPerformanceSummary(token: string, days: number = 30): Promise<PerformanceSummary> {
    const response = await fetch(`${BASE_URL}/performance-metrics/fleet_performance_summary/?days=${days}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<PerformanceSummary>(response);
  }

  async getPerformanceTrends(token: string, days: number = 90): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/performance-metrics/performance_trends/?days=${days}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: any[] }>(response);
    return data.results || [];
  }

  // Mileage Log Endpoints
  async getMileageLogs(token: string, params?: Record<string, any>): Promise<{ results: MileageLog[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/mileage-logs/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: MileageLog[], count: number }>(response);
  }

  async createMileageLog(token: string, logData: Partial<MileageLog>): Promise<MileageLog> {
    const response = await fetch(`${BASE_URL}/mileage-logs/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(logData),
    });

    return this.handleResponse<MileageLog>(response);
  }
}

export const fleetService = new FleetService();
export default fleetService;