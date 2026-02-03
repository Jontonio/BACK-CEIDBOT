import { DataSource } from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';

export default class RoleSeeder {
  
  public static async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Rol);

    const count = await roleRepository.count();

    if (count === 0) {

      const roles = [
        { TipoRol: 'admin_role', descripcion: 'Administrador del sistema' },
        { TipoRol: 'user_role', descripcion: 'Usuario estándar' },
        { TipoRol: 'viewer_role', descripcion: 'Solo lectura o invitado' },
        { TipoRol: 'supervisor_role', descripcion: 'Supervisor o jefe de área' },
      ];

      await roleRepository.save(roles);
      console.log('Roles iniciales insertados.');
    } else {
      console.log('ℹRoles ya existentes, sin cambios.');
    }
  }
}
