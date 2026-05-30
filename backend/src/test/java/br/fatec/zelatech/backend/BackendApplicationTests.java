package br.fatec.zelatech.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void genHash() {
		System.out.println("HASH123456=" + new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("123456"));
	}

}
