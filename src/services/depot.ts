// Depot Management API Service
const BASE_URL = 'https://kmrl-backend-qjvw.onrender.com/api/v1/depot-management';

export interface Depot {
  id: string;
  code: string;
  name: string;
  depot_type: 'MAIN' | 'SATELLITE' | 'MAINTENANCE';
  status: 'OPERATIONAL' | 'PLANNED' | 'MAINTENANCE' | 'CLOSED';
  location?: string;
  latitude?: string;
  longitude?: string;
  total_area_sqm?: string;
  max_trainset_capacity: number;
  operational_since?: string;
  operating_hours_start?: string;
  operating_hours_end?: string;
  is_24_hour_operation?: boolean;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  has_maintenance_workshop?: boolean;
  has_inspection_bay_line?: boolean;
  has_washing_facility?: boolean;
  has_fueling_station?: boolean;
  has_wheel_profiling?: boolean;
  has_heavy_maintenance?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  depot: string;
  track_number: string;
  track_type: 'STABLING' | 'MAINTENANCE' | 'INSPECTION' | 'WASHING' | 'STORAGE';
  status: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  length_meters?: string;
  gauge_mm?: number;
  max_trainsets?: number;
  has_third_rail?: boolean;
  has_overhead_line?: boolean;
  power_supply_voltage?: number;
  has_track_circuits?: boolean;
  has_signal_system?: boolean;
  has_emergency_brake?: boolean;
  created_at: string;
  updated_at: string;
}

export interface StablingBay {
  id: string;
  depot: string;
  track?: string;
  bay_number: string;
  position_on_track?: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'BLOCKED';
  length_meters?: string;
  width_meters?: string;
  can_accommodate_trainset_length?: string;
  has_pit_access?: boolean;
  has_overhead_access?: boolean;
  has_power_connection?: boolean;
  has_air_supply?: boolean;
  has_water_supply?: boolean;
  priority_level?: number;
  is_preferred_for_branded_trains?: boolean;
  is_cleaning_bay?: boolean;
  current_trainset?: string;
  occupied_since?: string;
  expected_departure?: string;
  created_at: string;
  updated_at: string;
}

export interface CleaningSlot {
  id: string;
  depot: string;
  cleaning_bay: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cleaning_type: 'STANDARD' | 'DEEP' | 'EXTERIOR_ONLY' | 'INTERIOR_ONLY';
  estimated_duration_minutes?: number;
  assigned_team?: string;
  crew_size?: number;
  requires_special_equipment?: boolean;
  equipment_list?: string[];
  estimated_cost?: string;
  trainset?: string;
  team_leader?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  quality_score?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShuntingPlan {
  id: string;
  depot: string;
  plan_name: string;
  plan_type: 'DAILY' | 'WEEKLY' | 'SPECIAL' | 'EMERGENCY';
  status: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  planned_start_time: string;
  planned_end_time: string;
  total_movements?: number;
  estimated_duration_minutes?: number;
  estimated_energy_cost?: string;
  complexity_score?: number;
  assigned_operator?: string;
  supervisor?: string;
  notes?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  actual_duration_minutes?: number;
  actual_energy_cost?: string;
  created_at: string;
  updated_at: string;
}

export interface DepotEvent {
  id: string;
  depot: string;
  event_type: 'ARRIVAL' | 'DEPARTURE' | 'MAINTENANCE' | 'CLEANING' | 'EMERGENCY' | 'INSPECTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description?: string;
  trainset?: string;
  stabling_bay?: string;
  event_datetime: string;
  duration_minutes?: number;
  affected_operations?: string[];
  estimated_cost_impact?: string;
  service_impact?: 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE';
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  follow_up_required?: boolean;
  follow_up_notes?: string;
  external_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface DepotUtilization {
  id: string;
  depot: string;
  date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY';
  total_stabling_capacity: number;
  occupied_stabling_bays: number;
  available_stabling_bays: number;
  blocked_stabling_bays: number;
  total_arrivals: number;
  total_departures: number;
  shunting_movements: number;
  scheduled_maintenance_count: number;
  unscheduled_maintenance_count: number;
  cleaning_operations: number;
  average_turnaround_time_minutes?: string;
  energy_consumption_kwh?: string;
  water_consumption_liters?: string;
  staff_on_duty?: number;
  overtime_hours?: string;
  safety_incidents?: number;
  equipment_failures?: number;
  operational_delays_minutes?: number;
  operational_cost?: string;
  maintenance_cost?: string;
  cleaning_cost?: string;
  created_at: string;
  updated_at: string;
}

class DepotService {
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

  // Depot Endpoints
  async getDepots(token: string, params?: Record<string, any>): Promise<{ results: Depot[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/depots/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: Depot[], count: number }>(response);
  }

  async getDepot(token: string, id: string): Promise<Depot> {
    const response = await fetch(`${BASE_URL}/depots/${id}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<Depot>(response);
  }

  async createDepot(token: string, depotData: Partial<Depot>): Promise<Depot> {
    const response = await fetch(`${BASE_URL}/depots/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(depotData),
    });

    return this.handleResponse<Depot>(response);
  }

  async updateDepot(token: string, id: string, depotData: Partial<Depot>): Promise<Depot> {
    const response = await fetch(`${BASE_URL}/depots/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(depotData),
    });

    return this.handleResponse<Depot>(response);
  }

  async getDepotSummary(token: string, id: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/depots/${id}/summary/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<any>(response);
  }

  async getBayOccupancy(token: string, id: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/depots/${id}/bay_occupancy/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<any>(response);
  }

  async getUtilizationTrends(token: string, id: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/depots/${id}/utilization_trends/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<any>(response);
  }

  // Stabling Bay Endpoints
  async getStablingBays(token: string, params?: Record<string, any>): Promise<{ results: StablingBay[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/stabling-bays/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: StablingBay[], count: number }>(response);
  }

  async getAvailableBays(token: string): Promise<StablingBay[]> {
    const response = await fetch(`${BASE_URL}/stabling-bays/available/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: StablingBay[] }>(response);
    return data.results || [];
  }

  async getOccupiedBays(token: string): Promise<StablingBay[]> {
    const response = await fetch(`${BASE_URL}/stabling-bays/occupied/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: StablingBay[] }>(response);
    return data.results || [];
  }

  async assignTrainsetToBay(token: string, bayId: string, trainsetId: string, expectedDeparture?: string): Promise<StablingBay> {
    const response = await fetch(`${BASE_URL}/stabling-bays/${bayId}/assign_trainset/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        trainset_id: trainsetId,
        expected_departure: expectedDeparture
      }),
    });

    return this.handleResponse<StablingBay>(response);
  }

  async releaseTrainsetFromBay(token: string, bayId: string): Promise<StablingBay> {
    const response = await fetch(`${BASE_URL}/stabling-bays/${bayId}/release_trainset/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<StablingBay>(response);
  }

  // Cleaning Slot Endpoints
  async getCleaningSlots(token: string, params?: Record<string, any>): Promise<{ results: CleaningSlot[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/cleaning-slots/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: CleaningSlot[], count: number }>(response);
  }

  async getAvailableCleaningSlots(token: string): Promise<CleaningSlot[]> {
    const response = await fetch(`${BASE_URL}/cleaning-slots/available_slots/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: CleaningSlot[] }>(response);
    return data.results || [];
  }

  async getTodayCleaningSchedule(token: string): Promise<CleaningSlot[]> {
    const response = await fetch(`${BASE_URL}/cleaning-slots/today_schedule/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: CleaningSlot[] }>(response);
    return data.results || [];
  }

  async bookCleaningSlot(token: string, slotId: string, trainsetId: string, teamLeaderId?: string): Promise<CleaningSlot> {
    const response = await fetch(`${BASE_URL}/cleaning-slots/${slotId}/book_slot/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        trainset_id: trainsetId,
        team_leader_id: teamLeaderId
      }),
    });

    return this.handleResponse<CleaningSlot>(response);
  }

  async startCleaning(token: string, slotId: string): Promise<CleaningSlot> {
    const response = await fetch(`${BASE_URL}/cleaning-slots/${slotId}/start_cleaning/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<CleaningSlot>(response);
  }

  async completeCleaning(token: string, slotId: string, qualityScore?: number, notes?: string): Promise<CleaningSlot> {
    const response = await fetch(`${BASE_URL}/cleaning-slots/${slotId}/complete_cleaning/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        quality_score: qualityScore,
        notes: notes
      }),
    });

    return this.handleResponse<CleaningSlot>(response);
  }

  // Shunting Plan Endpoints
  async getShuntingPlans(token: string, params?: Record<string, any>): Promise<{ results: ShuntingPlan[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/shunting-plans/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: ShuntingPlan[], count: number }>(response);
  }

  async createShuntingPlan(token: string, planData: Partial<ShuntingPlan>): Promise<ShuntingPlan> {
    const response = await fetch(`${BASE_URL}/shunting-plans/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(planData),
    });

    return this.handleResponse<ShuntingPlan>(response);
  }

  async approveShuntingPlan(token: string, planId: string): Promise<ShuntingPlan> {
    const response = await fetch(`${BASE_URL}/shunting-plans/${planId}/approve/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<ShuntingPlan>(response);
  }

  async startShuntingExecution(token: string, planId: string): Promise<ShuntingPlan> {
    const response = await fetch(`${BASE_URL}/shunting-plans/${planId}/start_execution/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<ShuntingPlan>(response);
  }

  async completeShuntingExecution(token: string, planId: string): Promise<ShuntingPlan> {
    const response = await fetch(`${BASE_URL}/shunting-plans/${planId}/complete_execution/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<ShuntingPlan>(response);
  }

  // Depot Event Endpoints
  async getDepotEvents(token: string, params?: Record<string, any>): Promise<{ results: DepotEvent[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/events/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: DepotEvent[], count: number }>(response);
  }

  async getActiveIncidents(token: string): Promise<DepotEvent[]> {
    const response = await fetch(`${BASE_URL}/events/active_incidents/`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await this.handleResponse<{ results: DepotEvent[] }>(response);
    return data.results || [];
  }

  async resolveEvent(token: string, eventId: string, notes?: string): Promise<DepotEvent> {
    const response = await fetch(`${BASE_URL}/events/${eventId}/resolve_event/`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ notes }),
    });

    return this.handleResponse<DepotEvent>(response);
  }

  // Utilization Endpoints
  async getUtilization(token: string, params?: Record<string, any>): Promise<{ results: DepotUtilization[], count: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${BASE_URL}/utilization/?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<{ results: DepotUtilization[], count: number }>(response);
  }

  async getPerformanceSummary(token: string, days: number = 30): Promise<any> {
    const response = await fetch(`${BASE_URL}/utilization/performance_summary/?days=${days}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<any>(response);
  }
}

export const depotService = new DepotService();
export default depotService;