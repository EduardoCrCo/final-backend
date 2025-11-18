// import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title  } from "@tremor/react";
// import { CameraIcon } from "@heroicons/react/24/solid";
// import data from './data.json';
// export const Table = () => {
//     return (
    
//         <Title>Estadisticas de los Usuarios</Title>
//         <Card>
//         <Title>List of data</Title>

//         <Table marginTop='mt-5'>
//             <TableHead>
//                 <TableRow>
//                     <TableHeaderCell>Name</TableHeaderCell>
//                     <TableHeaderCell>Position</TableHeaderCell>
//                     <TableHeaderCell>Departament</TableHeaderCell>
//                     <TableHeaderCell>Status</TableHeaderCell>
//                 </TableRow>
//             </TableHead>
//             <TableBody>
//                 { data.map( (item) => (
//                     <TableRow>
//                         <TableCell> {item.Role} </TableCell>
//                         <TableCell> {item.departement} </TableCell>
//                         <TableCell> {item.name} </TableCell>
//                         <TableCell> <Badge text={item.status} color="teal" icon={CameraIcon} /> </TableCell>
//                     </TableRow>    
//                 )) }
//             </TableBody>
//         </Table>

//     </Card>
//     );
// }


import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";

import { CameraIcon } from "@heroicons/react/24/solid";
import data from "../data.json";

export const UsersTable = () => {
  return (
    <>
      <Title>Estadísticas de los Usuarios</Title>

      <Card className="mt-4">

        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.department}</TableCell>

                <TableCell>
                  <Badge color="teal" icon={CameraIcon}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};
