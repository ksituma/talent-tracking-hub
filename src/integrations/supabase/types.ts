export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applicationdate: string
          candidateid: string
          id: string
          jobid: string
          notes: string | null
          status: string
          updatedat: string | null
        }
        Insert: {
          applicationdate: string
          candidateid: string
          id?: string
          jobid: string
          notes?: string | null
          status: string
          updatedat?: string | null
        }
        Update: {
          applicationdate?: string
          candidateid?: string
          id?: string
          jobid?: string
          notes?: string | null
          status?: string
          updatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_jobid_fkey"
            columns: ["jobid"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          address: string
          coverletter: string | null
          createdat: string | null
          email: string
          firstname: string
          id: string
          lastname: string
          phone: string
          resume: string
          skills: string[] | null
          updatedat: string | null
        }
        Insert: {
          address: string
          coverletter?: string | null
          createdat?: string | null
          email: string
          firstname: string
          id?: string
          lastname: string
          phone: string
          resume: string
          skills?: string[] | null
          updatedat?: string | null
        }
        Update: {
          address?: string
          coverletter?: string | null
          createdat?: string | null
          email?: string
          firstname?: string
          id?: string
          lastname?: string
          phone?: string
          resume?: string
          skills?: string[] | null
          updatedat?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          candidateid: string
          createdat: string | null
          degree: string
          enddate: string | null
          fieldofstudy: string
          grade: string | null
          id: string
          institution: string
          startdate: string
          updatedat: string | null
        }
        Insert: {
          candidateid: string
          createdat?: string | null
          degree: string
          enddate?: string | null
          fieldofstudy: string
          grade?: string | null
          id?: string
          institution: string
          startdate: string
          updatedat?: string | null
        }
        Update: {
          candidateid?: string
          createdat?: string | null
          degree?: string
          enddate?: string | null
          fieldofstudy?: string
          grade?: string | null
          id?: string
          institution?: string
          startdate?: string
          updatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      experience: {
        Row: {
          candidateid: string
          company: string
          createdat: string | null
          description: string | null
          enddate: string | null
          id: string
          location: string | null
          position: string
          startdate: string
          updatedat: string | null
        }
        Insert: {
          candidateid: string
          company: string
          createdat?: string | null
          description?: string | null
          enddate?: string | null
          id?: string
          location?: string | null
          position: string
          startdate: string
          updatedat?: string | null
        }
        Update: {
          candidateid?: string
          company?: string
          createdat?: string | null
          description?: string | null
          enddate?: string | null
          id?: string
          location?: string | null
          position?: string
          startdate?: string
          updatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experience_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          closingdate: string
          company: string
          createdat: string | null
          createdby: string | null
          description: string
          featured: boolean | null
          id: string
          location: string
          logo: string | null
          minqualification: string
          posteddate: string
          requirements: string[]
          salary: string
          skills: string[]
          title: string
          type: string
          updatedat: string | null
          yearsofexperience: number
        }
        Insert: {
          closingdate: string
          company: string
          createdat?: string | null
          createdby?: string | null
          description: string
          featured?: boolean | null
          id?: string
          location: string
          logo?: string | null
          minqualification: string
          posteddate: string
          requirements: string[]
          salary: string
          skills: string[]
          title: string
          type: string
          updatedat?: string | null
          yearsofexperience: number
        }
        Update: {
          closingdate?: string
          company?: string
          createdat?: string | null
          createdby?: string | null
          description?: string
          featured?: boolean | null
          id?: string
          location?: string
          logo?: string | null
          minqualification?: string
          posteddate?: string
          requirements?: string[]
          salary?: string
          skills?: string[]
          title?: string
          type?: string
          updatedat?: string | null
          yearsofexperience?: number
        }
        Relationships: [
          {
            foreignKeyName: "jobs_createdby_fkey"
            columns: ["createdby"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_bodies: {
        Row: {
          candidateid: string
          createdat: string | null
          expirydate: string | null
          id: string
          joindate: string
          membershipnumber: string | null
          name: string
          updatedat: string | null
        }
        Insert: {
          candidateid: string
          createdat?: string | null
          expirydate?: string | null
          id?: string
          joindate: string
          membershipnumber?: string | null
          name: string
          updatedat?: string | null
        }
        Update: {
          candidateid?: string
          createdat?: string | null
          expirydate?: string | null
          id?: string
          joindate?: string
          membershipnumber?: string | null
          name?: string
          updatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_bodies_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          candidateid: string
          createdat: string | null
          description: string | null
          id: string
          publicationdate: string
          publisher: string
          title: string
          updatedat: string | null
          url: string | null
        }
        Insert: {
          candidateid: string
          createdat?: string | null
          description?: string | null
          id?: string
          publicationdate: string
          publisher: string
          title: string
          updatedat?: string | null
          url?: string | null
        }
        Update: {
          candidateid?: string
          createdat?: string | null
          description?: string | null
          id?: string
          publicationdate?: string
          publisher?: string
          title?: string
          updatedat?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      referees: {
        Row: {
          candidateid: string
          company: string
          createdat: string | null
          email: string
          id: string
          name: string
          phone: string | null
          position: string
          relationship: string
          updatedat: string | null
        }
        Insert: {
          candidateid: string
          company: string
          createdat?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          position: string
          relationship: string
          updatedat?: string | null
        }
        Update: {
          candidateid?: string
          company?: string
          createdat?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          position?: string
          relationship?: string
          updatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referees_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      short_courses: {
        Row: {
          candidateid: string
          completiondate: string
          createdat: string | null
          credentialurl: string | null
          expirydate: string | null
          id: string
          name: string
          provider: string
          updatedat: string | null
        }
        Insert: {
          candidateid: string
          completiondate: string
          createdat?: string | null
          credentialurl?: string | null
          expirydate?: string | null
          id?: string
          name: string
          provider: string
          updatedat?: string | null
        }
        Update: {
          candidateid?: string
          completiondate?: string
          createdat?: string | null
          credentialurl?: string | null
          expirydate?: string | null
          id?: string
          name?: string
          provider?: string
          updatedat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "short_courses_candidateid_fkey"
            columns: ["candidateid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlisting_criteria: {
        Row: {
          createdat: string | null
          createdby: string
          id: string
          jobid: string
          mineducationlevel: string
          minyearsexperience: number
          requiredskills: string[]
          updatedat: string | null
          weighteducation: number
          weightexperience: number
          weightskills: number
        }
        Insert: {
          createdat?: string | null
          createdby: string
          id?: string
          jobid: string
          mineducationlevel: string
          minyearsexperience: number
          requiredskills: string[]
          updatedat?: string | null
          weighteducation: number
          weightexperience: number
          weightskills: number
        }
        Update: {
          createdat?: string | null
          createdby?: string
          id?: string
          jobid?: string
          mineducationlevel?: string
          minyearsexperience?: number
          requiredskills?: string[]
          updatedat?: string | null
          weighteducation?: number
          weightexperience?: number
          weightskills?: number
        }
        Relationships: [
          {
            foreignKeyName: "shortlisting_criteria_createdby_fkey"
            columns: ["createdby"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shortlisting_criteria_jobid_fkey"
            columns: ["jobid"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdat: string | null
          email: string
          firstname: string
          id: string
          lastname: string
          password: string
          role: string
          updatedat: string | null
        }
        Insert: {
          createdat?: string | null
          email: string
          firstname: string
          id?: string
          lastname: string
          password: string
          role: string
          updatedat?: string | null
        }
        Update: {
          createdat?: string | null
          email?: string
          firstname?: string
          id?: string
          lastname?: string
          password?: string
          role?: string
          updatedat?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
