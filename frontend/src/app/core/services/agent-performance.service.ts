import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map } from 'rxjs';

export interface AgentData {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface TicketData {
  id: number;
  title: string;
  created_by: number;
  assigned_to: number | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface AgentPerformanceData {
  id: number;
  name: string;
  email: string;
  role: string;
  ticketsSolved: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  responseTime: number;
  status: 'active' | 'away' | 'offline';
  monthlyTarget: number;
  onlineHours: number;
}

@Injectable({
  providedIn: 'root'
})
export class AgentPerformanceService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAgentPerformance(): Observable<AgentPerformanceData[]> {
    return combineLatest([
      this.http.get<AgentData[]>(`${this.apiUrl}/auth/staff-users/`),
      this.http.get<TicketData[]>(`${this.apiUrl}/tickets/`)
    ]).pipe(
      map(([agents, tickets]) => {
        return agents.map((agent) => {
          const agentTickets = tickets.filter((t) => t.assigned_to === agent.id);
          const solvedTickets = agentTickets.filter((t) => t.status === 'closed').length;
          
          // Calculate average resolution time
          const resolutionTimes = agentTickets
            .filter((t) => t.status === 'closed')
            .map((t) => {
              const created = new Date(t.created_at).getTime();
              const updated = new Date(t.updated_at).getTime();
              return (updated - created) / (1000 * 60 * 60); // Convert to hours
            });
          
          const avgResolutionTime = resolutionTimes.length > 0
            ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
            : 0;

          return {
            id: agent.id,
            name: agent.full_name,
            email: agent.email,
            role: agent.role,
            ticketsSolved: solvedTickets,
            averageResolutionTime: parseFloat(avgResolutionTime.toFixed(1)),
            customerSatisfaction: 4.5 + Math.random() * 0.5, // Placeholder: can be replaced with feedback data
            responseTime: Math.floor(Math.random() * 5) + 1,
            status: 'active' as const,
            monthlyTarget: 150,
            onlineHours: Math.floor(Math.random() * 48) + 32,
          };
        });
      })
    );
  }

  getTeamMetrics(): Observable<{
    totalTickets: number;
    averageResolutionTime: number;
    teamSatisfaction: number;
    activeAgents: number;
  }> {
    return combineLatest([
      this.http.get<AgentData[]>(`${this.apiUrl}/auth/staff-users/`),
      this.http.get<TicketData[]>(`${this.apiUrl}/tickets/`)
    ]).pipe(
      map(([agents, tickets]) => {
        const closedTickets = tickets.filter((t) => t.status === 'closed');
        
        const resolutionTimes = closedTickets.map((t) => {
          const created = new Date(t.created_at).getTime();
          const updated = new Date(t.updated_at).getTime();
          return (updated - created) / (1000 * 60 * 60);
        });

        const avgResolutionTime = resolutionTimes.length > 0
          ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
          : 0;

        return {
          totalTickets: closedTickets.length,
          averageResolutionTime: parseFloat(avgResolutionTime.toFixed(1)),
          teamSatisfaction: 4.6,
          activeAgents: agents.length,
        };
      })
    );
  }
}
