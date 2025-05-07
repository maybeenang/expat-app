export interface LoginResponse {
    status: number;
    message: string;
    data: {
      'x-token': string;
      data_session: {
        nama: string;
        rm_number: string;
        timezone: string;
        role: string;
        exp: number;
        duration: number;
        is_ranap: boolean;
        is_rajal: boolean;
        redirect: string;
        list_dept: {
          rajal: {
            id_dept: number;
            nama_dept: string;
            prefix_dept_group: string;
          }[];
          ranap: {
            id_dept: number;
            nama_dept: string;
            prefix_dept_group: string;
          }[];
        };
      };
    };
  }