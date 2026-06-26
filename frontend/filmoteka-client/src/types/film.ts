export interface Film {
    id: number;
    naslov: string;
    godinaIzdanja: number;
    zanrId: number;
    opis?: string;        // Novo polje (upitnik znači da je opciono)
    uBioskopima: boolean; // Novo polje
}