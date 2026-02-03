import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export default class UserSeeder {

  public static async run(dataSource: DataSource): Promise<void> {

    const userRepository = dataSource.getRepository(Usuario);

    const count = await userRepository.count();

    if (count === 0) {
      const admin = userRepository.create({
        DNI:"12345678",
        Nombres:"admin",
        ApellidoPaterno:"admin",
        ApellidoMaterno:"admin",
        Celular:"987654321",
        Email:"admin@gmail.com",
        Direccion:"av. Example",
        IsActivo:false,
        Estado:true,
        Habilitado:true,
        Code:"+51",
        CodePhone:"+51",
        rolId: 1,
        Password: await bcrypt.hash('12345678', 10),
      });
      await userRepository.save(admin);

      console.log('Usuarios iniciales insertados.');
    } else {
      console.log('Usuarios ya existentes, sin cambios.');
    }

  }
}
