package br.fatec.zelatech.backend.repository.specification;

import br.fatec.zelatech.backend.model.Chamado;
import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import org.springframework.data.jpa.domain.Specification;

public class ChamadoSpecification {

    public static Specification<Chamado> comFiltros(StatusChamado status, CategoriaChamado categoria) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (categoria != null) {
                predicates.add(cb.equal(root.get("categoria"), categoria));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

}
